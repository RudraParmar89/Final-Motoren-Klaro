
import { Instagram, Youtube, Facebook, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {

  return (
    <footer id="contact" className="bg-black text-white pt-16 pb-8 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-10 border-b border-gray-700">
          <div className="lg:col-span-2">
            <img 
              src="/lovable-uploads/Screenshot_2025-10-20_015814-removebg-preview.png" 
              alt="Motoren Klaro Logo" 
              className="h-16 w-auto mb-6"
            />
            <p className="text-gray-300 mb-6">
              Motoren Klaro provides comprehensive car comparisons, detailed specifications, honest reviews, and connects you with trusted dealers like Navnit Group to ensure you make the best decision for your needs and budget.
            </p>
            <p className="text-gray-300 mb-6">
              BMW Showroom | Navnit Motors<br />
              CD Barfiwala Road, Juhu Lane,<br />
              Andheri West, Mumbai,<br />
              Maharashtra 400058
            </p>
            <h3 className="text-lg font-bold mb-4 text-white">Connect with Us</h3>
            <div className="flex space-x-4">
              <a 
                href="https://www.instagram.com/motorenklaro?igsh=MXU0aTZ1ZGpvN3Nhaw==" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://youtube.com/@motorenklaro?si=VSnX1yRvggPngYI2" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
              >
                <Youtube size={20} />
              </a>
              <a 
                href="https://www.facebook.com/profile.php?id=61579095444835" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://share.google/4XISPiZRr8ApFUSDR" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 transition-colors hover:bg-gray-700 hover:text-white"
                
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact Info</h3>
            <ul className="space-y-3 text-gray-300">
              <li>Email: info@motorenklaro.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>Address: CD Barfiwala Road, Juhu Lane, Andheri West, Mumbai 400058</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Motoren Klaro. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
