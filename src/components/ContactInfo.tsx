
import React from 'react';
import { Mail, Linkedin, Phone } from 'lucide-react';

const ContactInfo = () => {
  return (
    <section id="contact-info" className="bg-gradient-to-b from-white to-black text-white relative py-[8px] md:py-[15px]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-block mb-3 px-3 py-1 bg-white text-black rounded-full text-sm font-medium">
            Get In Touch
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
            Contact Us Today
          </h2>
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            Need help choosing the perfect car? Our expert team is here to assist you with detailed comparisons, technical specifications, and personalized recommendations for your next vehicle purchase.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Felix's Contact Info */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <img 
                src="/lovable-uploads/aa5291bd-2417-4c1e-9a02-0bcc71a92507.png"
                alt="Felix von Heland"
                className="w-24 h-24 rounded-full mb-3 object-cover filter grayscale"
              />
              <h3 className="text-lg font-bold text-gray-900">Felix von Heland</h3>
              <p className="text-gray-600 mb-1 text-sm">CEO and Founder</p>
              <p className="text-gray-500 mb-3 text-xs">Strategic Leadership & Vision</p>
              <div className="flex flex-col space-y-2">
                <a href="mailto:felix@motorenklaro.com" className="flex items-center text-gray-700 hover:text-blue-600 text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  felix@motorenklaro.com
                </a>
                <a 
                  href="https://www.linkedin.com/in/felixvonheland/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-blue-600 text-sm"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </div>

          {/* Love's Contact Info */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <img 
                src="/lovable-uploads/a9bb9110-964a-43b0-a5ab-7162140cd133.png"
                alt="Love Anderberg"
                className="w-24 h-24 rounded-full mb-3 object-cover filter grayscale"
              />
              <h3 className="text-lg font-bold text-gray-900">Jay Chandarana</h3>
              <p className="text-gray-600 mb-1 text-sm">Project Manager</p>
              <p className="text-gray-500 mb-3 text-xs">Operations & Customer Success</p>
              <div className="flex flex-col space-y-2">
                <a href="mailto:love@motorenklaro.com" className="flex items-center text-gray-700 hover:text-blue-600 text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  love@motorenklaro.com
                </a>
                <a 
                  href="https://www.linkedin.com/in/love-anderberg-67549a174/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-blue-600 text-sm"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn Profile
                </a>
                <a href="tel:+46760149508" className="flex items-center text-gray-700 hover:text-blue-600 text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  076-014 95 08
                </a>
              </div>
            </div>
          </div>

          {/* Third Team Member */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-700">
            <div className="flex flex-col items-center text-center">
              <img 
                src="/lovable-uploads/b862d5ae-6abb-44da-84f0-00a222f62906.png"
                alt="Technical Support Team"
                className="w-24 h-24 rounded-full mb-3 object-cover filter grayscale"
              />
              <h3 className="text-lg font-bold text-gray-900">Rudra Parmar</h3>
              <p className="text-gray-600 mb-1 text-sm">Designer & Developer</p>
              <p className="text-gray-500 mb-3 text-xs">All Rounder</p>
              <div className="flex flex-col space-y-2">
                <a href="mailto:support@motorenklaro.com" className="flex items-center text-gray-700 hover:text-blue-600 text-sm">
                  <Mail className="w-4 h-4 mr-2" />
                  parmarrudra975@gmail.com
                </a>
                <a 
                  href="https://www.linkedin.com/company/motorenklaro/" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-gray-700 hover:text-blue-600 text-sm"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  Company Page
                </a>
                <a href="tel:+46123456789" className="flex items-center text-gray-700 hover:text-blue-600 text-sm">
                  <Phone className="w-4 h-4 mr-2" />
                  +46 123 456 789
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
