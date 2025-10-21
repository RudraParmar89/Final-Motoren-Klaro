
import PageLayout from '@/components/PageLayout';
import { ArrowLeft, Mail, Linkedin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { useEffect } from 'react';

const Careers = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen bg-white">
      <PageLayout showContact={false}>
        <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-700 mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              
              <motion.h1 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.5 }} 
                className="text-4xl font-bold mb-6"
              >
                Join Navnit Motors
              </motion.h1>
              
              <div className="prose prose-lg max-w-none">
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 0.5, delay: 0.2 }} 
                  className="text-xl text-gray-600 mb-4"
                >
                  We're looking for passionate automotive enthusiasts to join our team at Navnit Motors, Mumbai's premier BMW dealership.
                </motion.p>
                
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-xl text-gray-600 mb-12"
                >
                  Join us in delivering exceptional customer experiences and become part of the luxury automotive industry.
                </motion.p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6 }}
                  className="mb-16"
                >
                  <h2 className="text-3xl font-bold mb-6">Why Join Navnit Motors?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                      {
                        title: "Premium Brand",
                        description: "Work with BMW, one of the world's most prestigious automotive brands."
                      },
                      {
                        title: "Career Growth",
                        description: "Develop your skills in sales, service, and automotive technology with training opportunities."
                      },
                      {
                        title: "Team Culture",
                        description: "Join a passionate team dedicated to excellence and customer satisfaction."
                      }
                    ].map((benefit, i) => (
                      <div key={i} className="bg-gray-50 p-6 rounded-lg border border-gray-100 h-full">
                        <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                        <p className="text-gray-600">{benefit.description}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm mt-12">
                    <h3 className="font-bold text-xl mb-6">Get in Touch</h3>
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-lg mb-4">Navnit Motors - Mumbai</h4>
                          <div className="space-y-3">
                            <div className="flex items-start">
                              <Mail className="w-5 h-5 mr-3 text-primary mt-1" />
                              <div>
                                <p className="font-medium">Email</p>
                                <a href="mailto:careers@navnitmotors.com" className="text-gray-600 hover:text-primary">
                                  careers@navnitmotors.com
                                </a>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <Phone className="w-5 h-5 mr-3 text-primary mt-1" />
                              <div>
                                <p className="font-medium">Phone</p>
                                <a href="tel:+912226707000" className="text-gray-600 hover:text-primary">
                                  +91 22 2670 7000
                                </a>
                              </div>
                            </div>
                            <div className="flex items-start">
                              <svg className="w-5 h-5 mr-3 text-primary mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <div>
                                <p className="font-medium">Location</p>
                                <p className="text-gray-600">
                                  CD Barfiwala Road, Juhu Lane,<br />
                                  Andheri West, Mumbai,<br />
                                  Maharashtra 400058
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-6 border-t">
                          <p className="text-sm text-gray-500">
                            Send your resume and cover letter to the email above. We'll get back to you within 3-5 business days.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </PageLayout>
    </div>
  );
};

export default Careers;
