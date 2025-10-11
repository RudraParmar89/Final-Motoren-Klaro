import PageLayout from '@/components/PageLayout';
import SEO from '@/components/SEO';
import ContactForm from '@/components/ContactForm';
import Map from '@/components/Map';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
  return (
    <PageLayout>
      <SEO 
        title="Navnit Motors Location - Mumbai Car Dealer | Motoren Klaro"
        description="Visit Navnit Motors, our trusted car dealer partner in Mumbai. Find our location, timings, and contact information for expert car buying assistance."
        keywords={['navnit motors mumbai', 'car dealer mumbai', 'navnit motors location', 'car showroom mumbai']}
      />
      
      <div className="min-h-screen bg-gray-50 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Contact Us
            </h1>
            <div className="max-w-4xl mx-auto space-y-4 text-lg text-gray-600">
              <p>
                <strong>Navnit Motors</strong> has been Mumbai's trusted automotive partner for decades, specializing in premium car brands including BMW, Mercedes-Benz, Audi, and luxury vehicles. Located in the heart of Andheri West, we offer comprehensive automotive solutions from sales to service.
              </p>
              <p>
                <strong>Motoren Klaro</strong> is our innovative digital platform that revolutionizes the car buying experience through AI-powered recommendations, detailed comparisons, and seamless online-to-offline integration. Together, we bridge traditional automotive expertise with cutting-edge technology.
              </p>
              <p>
                Whether you're looking for your dream car, need expert advice, or want to explore our latest inventory, our team is here to help you every step of the way.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-12 mb-16">
            {/* Navnit Motors Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">Navnit Motors</CardTitle>
                  <p className="text-gray-600">Premium Car Dealer in Mumbai</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h3 className="font-semibold mb-1">Address</h3>
                      <p className="text-gray-600">
                        BMW Showroom, Andheri (W), Mumbai<br />
                        C-Wing, WATER FORD-C, Ground<br />
                        CD Barfiwala Road, Juhu Lane<br />
                        Ganga Vihar, Andheri West<br />
                        Mumbai, Maharashtra 400058
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-gray-600">+91 22 6677 7777</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-gray-600">info@navnitmotors.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Clock className="text-primary mt-1 flex-shrink-0" size={20} />
                    <div>
                      <h3 className="font-semibold mb-1">Business Hours</h3>
                      <div className="text-gray-600 space-y-1">
                        <p>Monday - Saturday: 9:00 AM - 8:00 PM</p>
                        <p>Sunday: 10:00 AM - 6:00 PM</p>
                        <p className="text-sm text-gray-500 mt-2">
                          * Test drives available by appointment
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            
          </div>

          {/* Map Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-16"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Find Us on Map</CardTitle>
                <p className="text-gray-600">Locate Navnit Motors showroom in Mumbai</p>
              </CardHeader>
              <CardContent>
                <Map />
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900">Get In Touch</CardTitle>
                <p className="text-gray-600">Send us a message and we'll get back to you shortly</p>
              </CardHeader>
              <CardContent>
                <ContactForm />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Contact;