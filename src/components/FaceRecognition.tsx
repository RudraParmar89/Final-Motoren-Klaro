import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, CheckCircle, XCircle } from "lucide-react";
import * as faceapi from 'face-api.js';
import { supabase } from '@/integrations/supabase/client';
import { authorizedFaceImages } from '@/config/authorizedFaces';

interface FaceRecognitionProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

export const FaceRecognition = ({ onSuccess, onError }: FaceRecognitionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [modelsLoadedFrom, setModelsLoadedFrom] = useState<string | null>(null);
  const [descriptorCount, setDescriptorCount] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Reference face descriptors (these would be loaded from uploaded images)
  const referenceFaceDescriptors = useRef<Float32Array[]>([]);

  useEffect(() => {
    loadModels();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const tryLoadModelsFrom = async (baseUrl: string) => {
    // attempts to load the minimal set of models from baseUrl
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(baseUrl),
      faceapi.nets.faceLandmark68Net.loadFromUri(baseUrl),
      faceapi.nets.faceRecognitionNet.loadFromUri(baseUrl),
    ]);
  };

  const loadModels = async () => {
    try {
      setIsLoading(true);
      console.log('Loading face-api.js models...');
      // Try local models first (recommended). If not present, fall back to CDN.
      const localModelBase = '/models';
      const cdnModelBase = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model';

      const timeoutMs = 30000;

      // Helper: attempt load with timeout
      const attemptWithTimeout = async (fn: () => Promise<void>) => {
        return Promise.race([
          fn(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Model loading timeout')), timeoutMs))
        ]);
      };

      try {
        await attemptWithTimeout(() => tryLoadModelsFrom(localModelBase));
        console.log('Loaded face-api models from local /models');
        setModelsLoadedFrom('/models');
      } catch (localErr) {
        console.warn('Local models not available or failed to load:', localErr);
        try {
          await attemptWithTimeout(() => tryLoadModelsFrom(cdnModelBase));
          console.log('Loaded face-api models from CDN');
          setModelsLoadedFrom('cdn');
        } catch (cdnErr) {
          console.error('Failed to load models from both local and CDN:', cdnErr);
          throw cdnErr;
        }
      }
      
      // Load reference images and create descriptors
      await loadReferenceImages();
      setIsModelLoaded(true);
    } catch (error) {
      console.error('Error loading face-api models:', error);
      if (String(error).toLowerCase().includes('timeout')) {
        onError('Model loading timed out. Please check your internet connection and try again.');
      } else if (String(error).toLowerCase().includes('404') || String(error).toLowerCase().includes('not found')) {
        onError('Face recognition model files not found. Ensure /models is populated or CDN is reachable.');
      } else {
        onError('Failed to load face recognition models. Please try again. See console for details.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loadReferenceImages = async () => {
    try {
      const descriptors: Float32Array[] = [];
      console.log('Loading reference images...');

      // 1) Try loading from database if available
      try {
        const { data: faceImages, error } = await supabase
          .from('admin_face_images')
          .select('face_descriptor_encrypted, image_url');

        if (error) {
          console.warn('Error fetching face images from DB, will use local config:', error);
        } else if (faceImages && faceImages.length > 0) {
          console.log(`Found ${faceImages.length} face images in database`);
          
          // Process encrypted descriptors directly if available
          for (const faceImage of faceImages) {
            try {
              if (faceImage.face_descriptor_encrypted) {
                const { data: decryptedDescriptor, error: decryptError } = await supabase
                  .rpc('decrypt_biometric_data', {
                    encrypted_data: faceImage.face_descriptor_encrypted
                  });

                if (!decryptError && decryptedDescriptor) {
                  const descriptorArray = new Float32Array(Object.values(decryptedDescriptor));
                  descriptors.push(descriptorArray);
                  console.log('Loaded encrypted descriptor from DB');
                }
              } else if (faceImage.image_url) {
                const img = await faceapi.fetchImage(faceImage.image_url);
                const detection = await faceapi
                  .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
                  .withFaceLandmarks()
                  .withFaceDescriptor();
                if (detection) {
                  descriptors.push(detection.descriptor);
                  console.log('Loaded descriptor from DB image:', faceImage.image_url);
                }
              }
            } catch (err) {
              console.warn('Failed to process face data from DB:', err);
            }
          }
        }
      } catch (dbError) {
        console.warn('Database connection issue, using local images only:', dbError);
      }

      // 2) Always load local authorized images as well (source of truth for this app)
      console.log(`Loading ${authorizedFaceImages.length} local authorized images...`);
      for (const url of authorizedFaceImages) {
        try {
          console.log('Loading image:', url);
          
          // Check if image exists first
          const response = await fetch(url);
          if (!response.ok) {
            console.warn(`Image not found: ${url} (${response.status})`);
            continue;
          }
          
          const img = await faceapi.fetchImage(url);
          const detection = await faceapi
            .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptor();
            
          if (detection) {
            descriptors.push(detection.descriptor);
            console.log('Successfully loaded descriptor from:', url);
          } else {
            console.warn('No face detected in image:', url);
          }
        } catch (err) {
          console.warn('Failed to process local authorized face image:', url, err);
        }
      }

      referenceFaceDescriptors.current = descriptors;
      setDescriptorCount(descriptors.length);
      console.log(`Total loaded descriptors: ${descriptors.length} (DB + local)`);

      if (descriptors.length === 0) {
        console.error('No authorized faces configured; access will be denied.');
        onError('No authorized faces configured. Please contact administrator.');
        throw new Error('No authorized faces found.');
      }
    } catch (error) {
      console.error('Error loading reference images:', error);
      throw error;
    }
  };

  const startCamera = async () => {
    try {
      setIsCapturing(true);
      console.log('Requesting camera access...');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      console.log('Camera access granted');
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Failed to access camera';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please ensure a camera is connected.';
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Camera not supported in this browser.';
      }
      
      onError(errorMessage);
      setIsCapturing(false);
    }
  };

  const captureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current || !isModelLoaded) {
      onError('Camera or models not ready');
      return;
    }

    try {
      setIsLoading(true);
      
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      // Draw current video frame to canvas
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0);

      // Detect face and get descriptor
      const detection = await faceapi
        .detectSingleFace(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        onError('No face detected. Please ensure your face is clearly visible.');
        return;
      }

      let isMatch = false;
      let minDistance = Infinity;

      if (referenceFaceDescriptors.current.length === 0) {
        onError('No authorized faces configured. Access denied.');
        return;
      }

      // Compare with authorized reference descriptors
      const threshold = 0.5; // stricter threshold for admin access (lower = stricter)
      console.log(`Comparing against ${referenceFaceDescriptors.current.length} authorized face descriptors (threshold ${threshold})`);

      for (const referenceDescriptor of referenceFaceDescriptors.current) {
        const distance = faceapi.euclideanDistance(detection.descriptor, referenceDescriptor);
        console.log('Face comparison distance:', distance, 'threshold:', threshold);
        minDistance = Math.min(minDistance, distance);
        if (distance < threshold) {
          isMatch = true;
          console.log('Face match found! Distance:', distance);
          break;
        }
      }

      console.log('Minimum distance found:', minDistance, 'Match:', isMatch);

      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setIsCapturing(false);

      if (isMatch) {
        onSuccess();
      } else {
        onError('Face recognition failed. Access denied.');
      }
    } catch (error) {
      console.error('Error during face recognition:', error);
      onError('Face recognition failed');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  if (!isModelLoaded && isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-muted-foreground">Loading face recognition models...</p>
        <p className="text-xs text-muted-foreground">This may take up to 30 seconds</p>
      </div>
    );
  }

  if (!isModelLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-destructive">Face Recognition Unavailable</h3>
          <p className="text-sm text-muted-foreground">Face recognition models failed to load. Please refresh the page and try again.</p>
          <p className="text-xs text-muted-foreground">Models attempted from: {modelsLoadedFrom ?? 'none'}</p>
          <p className="text-xs text-muted-foreground">Authorized descriptors loaded: {descriptorCount}</p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Face Recognition</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Position your face in front of the camera for authentication
        </p>
        <div className="mb-4 text-xs text-muted-foreground">
          <div>Models loaded from: <strong>{modelsLoadedFrom ?? 'loading...'}</strong></div>
          <div>Authorized descriptors: <strong>{descriptorCount}</strong></div>
        </div>
      </div>

      {!isCapturing ? (
        <Button 
          onClick={startCamera} 
          className="w-full flex items-center gap-2"
          disabled={!isModelLoaded}
        >
          <Camera size={16} />
          Start Camera
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full max-w-md mx-auto rounded-lg border"
              style={{ maxHeight: '300px' }}
            />
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={captureAndRecognize} 
              className="flex-1 flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Recognizing...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Authenticate
                </>
              )}
            </Button>
            <Button 
              onClick={stopCamera}
              variant="outline"
              className="flex items-center gap-2"
            >
              <XCircle size={16} />
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};