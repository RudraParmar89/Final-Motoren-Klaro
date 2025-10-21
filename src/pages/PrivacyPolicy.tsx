import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import PageLayout from '@/components/PageLayout';
const PrivacyPolicy = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return <PageLayout>
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
            
            <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-600 mb-6">Last updated: January 15, 2025</p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
              <p className="text-gray-600 mb-4">
                At Motoren Klaro, a service of Navnit Motors ("we," "our," or "us"), we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our car comparison platform or use our automotive services.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
              <p className="text-gray-600 mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Browse and compare cars on our platform</li>
                <li>Save cars to your favorites</li>
                <li>Submit inquiries about vehicles</li>
                <li>Create an account on Motoren Klaro</li>
                <li>Contact us through our website</li>
                <li>Subscribe to our newsletter for car news and updates</li>
                <li>Use our car comparison tools</li>
              </ul>
              <p className="text-gray-600 mb-4">
                This information may include your name, email address, phone number, car preferences, budget information, and any other information you choose to provide when inquiring about vehicles.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-600 mb-4">
                We may use the information we collect for various purposes, including to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Provide car comparison and information services</li>
                <li>Respond to your inquiries about vehicles</li>
                <li>Save your favorite cars and preferences</li>
                <li>Send you relevant car news, updates, and automotive insights</li>
                <li>Improve and personalize your car search experience</li>
                <li>Analyze user behavior to enhance our platform</li>
                <li>Communicate with you about Navnit Motors' services and offerings</li>
                <li>Process and respond to customer service requests</li>
                <li>Provide recommendations based on your preferences</li>
                <li>Ensure security and prevent fraudulent activities</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Cookies and Tracking Technologies</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar tracking technologies to enhance your browsing experience on Motoren Klaro. These technologies help us remember your car preferences, saved favorites, and search history to provide a personalized experience. Cookies are small files stored on your device. You can control cookie settings through your browser preferences, though some features may not work properly if cookies are disabled.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Navnit Motors dealerships when you submit vehicle inquiries</li>
                <li>Service providers who help us operate our platform (hosting, analytics, email services)</li>
                <li>Legal authorities when required by law</li>
              </ul>
              <p className="text-gray-600 mb-4">
                When you submit an inquiry about a specific car, your contact information and inquiry details will be shared with the relevant Navnit Motors team to assist you with your automotive needs.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Retention</h2>
              <p className="text-gray-600 mb-4">
                We retain your personal information as long as your account is active or as needed to provide you services. Your saved favorites, search history, and preferences will be stored to enhance your experience. You may request deletion of your account and associated data at any time by contacting us.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Security</h2>
              <p className="text-gray-600 mb-4">
                At Navnit Motors, the security of your data is our priority. We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure. Your account is protected by authentication, and we use secure connections (HTTPS) for data transmission. However, no online platform is 100% secure, and we cannot guarantee absolute security.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Your Rights</h2>
              <p className="text-gray-600 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Access your personal information we hold</li>
                <li>Update or correct your account information</li>
                <li>Delete your account and personal data</li>
                <li>Export your saved cars and preferences</li>
                <li>Opt-out of marketing communications</li>
                <li>Manage your cookie preferences</li>
              </ul>
              <p className="text-gray-600 mb-4">
                To exercise any of these rights, please contact us using the information provided below.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                Motoren Klaro is not intended for children under 18 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
              </p>

              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Changes to This Privacy Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update our Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any significant changes by posting the updated policy on this page with a new "Last updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">11. Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="list-none pl-0 mb-4 text-gray-600">
                <li className="mb-2"><strong>Motoren Klaro</strong></li>
                <li className="mb-2">A service of Navnit Motors</li>
                <li className="mb-2">Email: info@motorenklaro.com</li>
                <li className="mb-2">Website: www.motorenklaro.com</li>
              </ul>
              <p className="text-gray-600 mb-4">
                For immediate assistance with vehicle inquiries, please use our contact form or call your nearest Navnit Motors dealership.
              </p>
              
            </div>
          </div>
        </div>
      </section>
    </PageLayout>;
};
export default PrivacyPolicy;