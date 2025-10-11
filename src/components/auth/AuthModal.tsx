import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Chrome, Facebook, Music, Eye, EyeOff } from "lucide-react";
import { FaceRecognition } from "@/components/FaceRecognition";
import { useNavigate } from "react-router-dom";
import { DEV_ADMIN_CREDENTIALS } from '@/config/devAdminCredentials';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showFaceRecognition, setShowFaceRecognition] = useState(false);
  const [showAdminCredentials, setShowAdminCredentials] = useState(true);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      });

      if (error) throw error;

      if (data.user && !data.user.email_confirmed_at) {
        toast({
          title: "Check your email",
          description: "We've sent you a confirmation link to complete your signup.",
        });
      } else {
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
        onClose();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully.",
      });
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) throw error;

      toast({
        title: "Password reset sent",
        description: "Check your email for the password reset link.",
      });
      setShowForgotPassword(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleFacebookSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleSpotifySignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'spotify',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the simple RPC function to verify admin credentials
      const { data: isValid, error } = await supabase.rpc('verify_admin_credentials_simple', {
        p_email: adminEmail,
        p_password: adminPassword
      });

      if (error) {
        // Log full error and show more detailed message for debugging
        console.error('RPC Error (verify_admin_credentials_simple):', error);
        const msg = error.message || JSON.stringify(error);

        // If running locally in dev and the function is missing or RPC fails,
        // fallback to a preconfigured dev credential to allow local testing.
        if (import.meta.env.DEV && String(msg).toLowerCase().includes('could not find the function')) {
          console.warn('RPC missing; using DEV_ADMIN_CREDENTIALS fallback for local development');
          if (adminEmail === DEV_ADMIN_CREDENTIALS.email && adminPassword === DEV_ADMIN_CREDENTIALS.password) {
            setShowAdminCredentials(false);
            setShowFaceRecognition(true);
            toast({ title: 'Credentials verified (dev fallback)', description: 'Please complete face recognition authentication.' });
            return;
          } else {
            throw new Error('Invalid admin credentials (dev fallback)');
          }
        }

        throw new Error(`Authentication system error: ${msg}`);
      }

      // isValid should be a boolean (Postgres boolean returned as true/false)
      if (typeof isValid === 'boolean' && isValid) {
        // Credentials valid, proceed to face recognition
        setShowAdminCredentials(false);
        setShowFaceRecognition(true);
        toast({
          title: "Credentials verified",
          description: "Please complete face recognition authentication.",
        });
      } else if (typeof isValid === 'boolean' && !isValid) {
        throw new Error('Invalid admin credentials');
      } else {
        console.error('Unexpected RPC response for verify_admin_credentials_simple:', isValid);
        throw new Error('Authentication system returned unexpected response. Check server logs.');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message || "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceRecognitionSuccess = () => {
    localStorage.setItem('admin_authenticated', 'true');
    toast({
      title: "Admin authenticated",
      description: "Face recognition successful. Welcome, Admin!",
    });
    onClose();
    navigate('/admin');
  };

  const handleFaceRecognitionError = (error: string) => {
    toast({
      variant: "destructive",
      title: "Authentication failed",
      description: error,
    });
    setShowFaceRecognition(false);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setAdminEmail('');
    setAdminPassword('');
    setShowForgotPassword(false);
    setShowFaceRecognition(false);
    setShowAdminCredentials(true);
    setShowSignInPassword(false);
    setShowSignUpPassword(false);
    setShowAdminPassword(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Motoren Klaro</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            {showForgotPassword ? (
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowForgotPassword(false)}
                >
                  Back to Sign In
                </Button>
              </form>
            ) : (
              <>
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showSignInPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(!showSignInPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showSignInPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </Button>
                </form>
                
                <div className="mt-4 space-y-2">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                   <div className="grid grid-cols-3 gap-2">
                     <Button variant="outline" size="sm" onClick={handleGoogleSignIn} className="flex items-center gap-2">
                       <Chrome size={16} />
                       Google
                     </Button>
                     <Button variant="outline" size="sm" onClick={handleFacebookSignIn} className="flex items-center gap-2">
                       <Facebook size={16} />
                       Facebook
                     </Button>
                     <Button variant="outline" size="sm" onClick={handleSpotifySignIn} className="flex items-center gap-2">
                       <Music size={16} />
                       Spotify
                     </Button>
                   </div>
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Display Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showSignUpPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSignUpPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
            
            <div className="mt-4 space-y-2">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
               <div className="grid grid-cols-3 gap-2">
                 <Button variant="outline" size="sm" onClick={handleGoogleSignIn} className="flex items-center gap-2">
                   <Chrome size={16} />
                   Google
                 </Button>
                 <Button variant="outline" size="sm" onClick={handleFacebookSignIn} className="flex items-center gap-2">
                   <Facebook size={16} />
                   Facebook
                 </Button>
                 <Button variant="outline" size="sm" onClick={handleSpotifySignIn} className="flex items-center gap-2">
                   <Music size={16} />
                   Spotify
                 </Button>
               </div>
            </div>
          </TabsContent>
          
          <TabsContent value="admin">
            {showFaceRecognition ? (
              <FaceRecognition 
                onSuccess={handleFaceRecognitionSuccess}
                onError={handleFaceRecognitionError}
              />
            ) : showAdminCredentials ? (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Admin Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="Enter admin email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <div className="relative">
                    <Input
                      id="admin-password"
                      type={showAdminPassword ? "text" : "password"}
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter admin password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showAdminPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Continue to Face Recognition"}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Admin access requires both password and face recognition
                </p>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <p className="text-muted-foreground">Credentials verified. Complete face recognition to access admin panel.</p>
                <Button 
                  onClick={() => {
                    setShowAdminCredentials(true);
                    setShowFaceRecognition(false);
                  }} 
                  variant="outline" 
                  className="w-full"
                >
                  Back to Credentials
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};