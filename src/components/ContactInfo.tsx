
import React from 'react';
import { Mail, Linkedin, Phone } from 'lucide-react';

const ContactInfo = () => {
  return (
    <section id="contact-info" className="bg-gradient-to-b from-white to-black text-white relative py-[8px] md:py-[15px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block mb-3 px-3 py-1 bg-white text-black rounded-full text-sm font-medium">
            Developers
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Motoren Klaro Team
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Need help choosing the perfect car? Our expert team is here to assist you with detailed comparisons, technical specifications, and personalized recommendations for your next vehicle purchase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ADI's Contact Info */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <img
                src="/lovable-uploads/WhatsApp Image 2025-10-10 at 22.52.22_3bdb6dcd.jpg"
                alt="Felix von Heland"
                onError={(e) => { (e.target as HTMLImageElement).src = '/lovable-uploads/WIN_20250919_19_23_42_Pro.jpg'; }}
                className="w-24 h-24 rounded-full mb-3 object-cover filter grayscale"
              />
              <h3 className="text-lg font-bold text-gray-900">Aditya Mehta</h3>
              <p className="text-gray-600 mb-1 text-sm">Full Stack Developer</p>
              <p className="text-gray-500 mb-3 text-xs">All Rounder</p>
              <div className="flex flex-col space-y-2">
                <a href="adimehta0077@gmail.com" className="flex items-center text-gray-700 hover:text-blue-600 text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  adimehta0077@gmail.com
                </a>
                <a 
                  href="https://www.linkedin.com/in/aditya-mehta-626980294?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app " 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-blue-600 text-sm"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn Profile
                </a>
                
                <a href="9967904671" className="flex items-center text-gray-700 hover:text-blue-600 text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  +91 9967904671
                </a>
              </div>
            </div>
          </div>

          {/* JAY's Contact Info */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <img
                src="\lovable-uploads\Screenshot 2025-10-12 174448.png"
                alt="Love Anderberg"
                onError={(e) => { (e.target as HTMLImageElement).src = '/lovable-uploads/WIN_20250919_19_23_42_Pro.jpg'; }}
                className="w-24 h-24 rounded-full mb-3 object-cover filter grayscale"
              />
              <h3 className="text-lg font-bold text-gray-900">Jay Chandarana</h3>
              <p className="text-gray-600 mb-1 text-sm">Project Manager</p>
              <p className="text-gray-500 mb-3 text-xs">Operations & Customer Success</p>
              <div className="flex flex-col space-y-2">
                <a href="jaychandarana10@gmail.com " className="flex items-center text-gray-700 hover:text-blue-600 text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  jaychandarana10@gmail.com 
                </a>
                <a 
                  href="https://www.linkedin.com/in/jay-chandarana-408a20272?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-blue-600 text-sm"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn Profile
                </a>
                <a href="9967904671" className="flex items-center text-gray-700 hover:text-blue-600 text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  +91 9967904671
                </a>
              </div>
            </div>
          </div>

          {/* RUDRA */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <img 
                src="\lovable-uploads\Screenshot 2025-10-12 140001.png"
                alt="Technical Support Team"
                className="w-24 h-24 rounded-full mb-3 object-cover filter grayscale"
              />
              <h3 className="text-lg font-bold text-gray-900">Rudra Parmar</h3>
              <p className="text-gray-600 mb-1 text-sm">Designer & Developer</p>
              <p className="text-gray-500 mb-3 text-xs">Strategic Leadership & Vision</p>
              <div className="flex flex-col space-y-2">
                <a href="parmarrudra975@gmail.com" className="flex items-center text-gray-700 hover:text-blue-600 text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  parmarrudra975@gmail.com
                </a>
                <a 
                  href="https://www.linkedin.com/in/rudra-parmar-688222357?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app " 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-blue-600 text-sm"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn Profile
                </a>
                <a href="9892245495" className="flex items-center text-gray-700 hover:text-blue-600 text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  +91 9892245495
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfo;
