
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X, ChevronDown, Search, Heart, User } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/auth/AuthModal";
import { SearchModal } from "@/components/search/SearchModal";
import { FavoritesModal } from "@/components/favorites/FavoritesModal";
import { ProfileModal } from "@/components/profile/ProfileModal";
import { CarComparison } from "@/components/CarComparison";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <>
    <motion.nav className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full", isScrolled ? "bg-white shadow-sm" : "bg-black")} initial={{
      opacity: 1,
      y: 0
    }} animate={{
      opacity: 1,
      y: 0
    }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/">
              <img 
                src={isScrolled ? "/lovable-uploads/8933c66d-7d2c-492e-ad0d-65c188eaf5ed.png" : "/lovable-uploads/2d74a0f2-fa7c-454b-a1eb-b62e5eac1b67.png"} 
                alt="MotorenKlaro x Navnit Collaboration Logo" 
                className="h-12 w-auto scale-x-110 scale-90 transition-all duration-300 ease-in-out" 
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu className={cn(isScrolled ? "" : "text-white")}>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800")} asChild>
                    <Link to="/">
                      Home
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800")} asChild>
                    <Link to="/about">
                      About Us
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn(isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800")}>
                    Price
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[500px] grid-cols-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/cars" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                            <div className="font-medium">All Cars</div>
                            <p className="text-sm text-gray-500">Browse our complete collection</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/cars?price_range=1-20" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                            <div className="font-medium">₹1-20 Lakhs</div>
                            <p className="text-sm text-gray-500">Budget-friendly options</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/cars?price_range=20-40" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                            <div className="font-medium">₹20-40 Lakhs</div>
                            <p className="text-sm text-gray-500">Mid-range vehicles</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/cars?price_range=40-60" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                            <div className="font-medium">₹40-60 Lakhs</div>
                            <p className="text-sm text-gray-500">Premium segment</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/cars?price_range=60-100" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                            <div className="font-medium">₹60 Lakhs - 1 Cr</div>
                            <p className="text-sm text-gray-500">Luxury cars</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                         <NavigationMenuLink asChild>
                           <Link to="/cars?price_range=100-above" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                             <div className="font-medium">1 cr and above</div>
                             <p className="text-sm text-gray-500">Super luxury segment</p>
                           </Link>
                         </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn(isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800")}>
                    Car Categories
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid gap-3 p-4 w-[500px] grid-cols-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/cars" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                            <div className="font-medium">All Cars</div>
                            <p className="text-sm text-gray-500">Browse our complete collection</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/cars?body_type=SUV" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                            <div className="font-medium">SUVs</div>
                            <p className="text-sm text-gray-500">Family-friendly SUVs</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/cars?body_type=Sedan" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                            <div className="font-medium">Sedans</div>
                            <p className="text-sm text-gray-500">Classic sedans</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/cars?body_type=Hatchback" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                            <div className="font-medium">Hatchbacks</div>
                            <p className="text-sm text-gray-500">Compact city cars</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link to="/cars?fuel_type=Electric" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                            <div className="font-medium">Electric</div>
                            <p className="text-sm text-gray-500">Eco-friendly EVs</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                       <li>
                         <NavigationMenuLink asChild>
                           <Link to="/cars?body_type=Coupe" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                             <div className="font-medium">Coupes</div>
                             <p className="text-sm text-gray-500">Sporty coupes</p>
                           </Link>
                         </NavigationMenuLink>
                       </li>
                       <li>
                         <NavigationMenuLink asChild>
                           <Link to="/cars?body_type=Convertible" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                             <div className="font-medium">Convertibles</div>
                             <p className="text-sm text-gray-500">Open-top driving</p>
                           </Link>
                         </NavigationMenuLink>
                       </li>
                       <li>
                         <NavigationMenuLink asChild>
                           <Link to="/cars?body_type=MPV" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                             <div className="font-medium">MPVs</div>
                             <p className="text-sm text-gray-500">Multi-purpose vehicles</p>
                           </Link>
                         </NavigationMenuLink>
                       </li>
                       <li>
                         <NavigationMenuLink asChild>
                           <Link to="/cars?body_type=Van" className="block p-3 space-y-1 rounded-md hover:bg-gray-100">
                             <div className="font-medium">Vans</div>
                             <p className="text-sm text-gray-500">Commercial vehicles</p>
                           </Link>
                         </NavigationMenuLink>
                       </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                
                <NavigationMenuItem>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800")} asChild>
                    <Link to="/blog">
                      Car News
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), isScrolled ? "text-gray-700 hover:text-gray-900" : "text-gray-100 hover:text-white bg-transparent hover:bg-gray-800")} asChild>
                    <Link to="/contact">
                      Contact Us
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <button 
                    onClick={() => setShowSearchModal(true)}
                    className={cn("p-2 rounded-md transition-colors", isScrolled ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100" : "text-gray-100 hover:text-white hover:bg-gray-800")}
                  >
                    <Search size={20} />
                  </button>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <button 
                    onClick={() => user ? setShowFavoritesModal(true) : setShowAuthModal(true)}
                    className={cn("p-2 rounded-md transition-colors", isScrolled ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100" : "text-gray-100 hover:text-white hover:bg-gray-800")}
                  >
                    <Heart size={20} />
                  </button>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <button 
                    onClick={() => user ? setShowProfileModal(true) : setShowAuthModal(true)}
                    className={cn("p-2 rounded-md transition-colors", isScrolled ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100" : "text-gray-100 hover:text-white hover:bg-gray-800")}
                  >
                    <User size={20} />
                  </button>
                </NavigationMenuItem>
                
                {!user && (
                  <NavigationMenuItem>
                    <button 
                      onClick={() => setShowAuthModal(true)}
                      className={cn("px-4 py-2 rounded-md transition-colors", isScrolled ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-primary text-primary-foreground hover:bg-primary/90")}
                    >
                      Sign Up
                    </button>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className={cn("focus:outline-none", isScrolled ? "text-gray-700" : "text-white")}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu - Reduced height and simplified */}
      <div className={cn("md:hidden transition-all duration-300 overflow-hidden w-full", isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0")}>
        <div className={cn("px-3 pt-2 pb-3 space-y-1 shadow-sm overflow-y-auto max-h-80", isScrolled ? "bg-white" : "bg-black")}>
          <Link to="/" className={cn("block px-3 py-1.5 rounded-md text-sm", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")} onClick={() => {
            setIsMenuOpen(false);
            window.scrollTo(0, 0);
          }}>
            Home
          </Link>
          
          <Link to="/about" className={cn("block px-3 py-1.5 rounded-md text-sm", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")} onClick={() => {
            setIsMenuOpen(false);
            window.scrollTo(0, 0);
          }}>
            About Us
          </Link>
          
          {/* Simplified Car Categories - no dropdown */}
          <Link to="/cars" className={cn("block px-3 py-1.5 rounded-md text-sm", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")} onClick={() => {
            setIsMenuOpen(false);
            window.scrollTo(0, 0);
          }}>
            All Cars
          </Link>
          
          
          <Link to="/blog" className={cn("block px-3 py-1.5 rounded-md text-sm", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")} onClick={() => {
            setIsMenuOpen(false);
            window.scrollTo(0, 0);
          }}>
            Car News
          </Link>
          
          <Link to="/contact" className={cn("block px-3 py-1.5 rounded-md text-sm", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")} onClick={() => {
            setIsMenuOpen(false);
            window.scrollTo(0, 0);
          }}>
            Contact Us
          </Link>
          
          <div className="flex items-center gap-2 px-3 py-1.5">
            <button 
              onClick={() => setShowSearchModal(true)}
              className={cn("p-2 rounded-md transition-colors", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")}
            >
              <Search size={18} />
            </button>
            <button 
              onClick={() => user ? setShowFavoritesModal(true) : setShowAuthModal(true)}
              className={cn("p-2 rounded-md transition-colors", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")}
            >
              <Heart size={18} />
            </button>
            <button 
              onClick={() => user ? setShowProfileModal(true) : setShowAuthModal(true)}
              className={cn("p-2 rounded-md transition-colors", isScrolled ? "text-gray-700 hover:bg-gray-50" : "text-gray-200 hover:bg-gray-900")}
            >
              <User size={18} />
            </button>
          </div>
          
          {!user && (
            <button 
              onClick={() => setShowAuthModal(true)}
              className={cn("block w-full text-left px-3 py-1.5 rounded-md text-sm", isScrolled ? "text-primary-foreground bg-primary hover:bg-primary/90" : "text-primary-foreground bg-primary hover:bg-primary/90")}
            >
              Sign Up
            </button>
          )}
        </div>
      </div>
      </motion.nav>

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
      <FavoritesModal 
        isOpen={showFavoritesModal} 
        onClose={() => setShowFavoritesModal(false)} 
        user={user} 
      />
      <ProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        user={user}
        onSignOut={() => {
          setShowProfileModal(false);
          setShowFavoritesModal(false);
        }}
      />
      <CarComparison 
        isOpen={showComparisonModal} 
        onClose={() => setShowComparisonModal(false)} 
      />
    </>
  );
};

export default Navbar;
