import React from "react";
import { ChevronDown, Search, Menu, X , LogIn} from "lucide-react";
import { Button } from '../ui/button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white border-b border-gray-200 relative">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="logo">
            <img src="/LOGO.png" alt="Logo" className="h-8 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#" className="text-orange-500 font-medium">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">
              Courses
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">
              Blog
            </a>
            <div className="flex items-center space-x-1 group relative">
              <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">
                Page
              </a>
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-orange-500 transition-colors" />
            </div>
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">
              LearnPress Add-On
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">
              Premium Theme
            </a>
          </nav>

          {/* Desktop Right side */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => window.location.href = '/login'}
              className="text-gray-700 font-bold hover:text-orange-500"
            >
              <LogIn className = "w-4 h-4"></LogIn>
              Login
            </Button>
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-50">
            <nav className="px-4 py-6 space-y-4">
              <a 
                href="/" 
                className="block text-orange-500 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </a>
              <a 
                href="#" 
                className="block text-gray-700 hover:text-orange-500 py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Courses
              </a>
              <a 
                href="#" 
                className="block text-gray-700 hover:text-orange-500 py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blog
              </a>
              <div className="py-2">
                <a 
                  href="#" 
                  className="block text-gray-700 hover:text-orange-500 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Page
                </a>
              </div>
              <a 
                href="#" 
                className="block text-gray-700 hover:text-orange-500 py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                LearnPress Add-On
              </a>
              <a 
                href="#" 
                className="block text-gray-700 hover:text-orange-500 py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Premium Theme
              </a>
              
              {/* Mobile Login/Register */}
              <div className="pt-4 border-t border-gray-200">
                <button 
                  className="block text-gray-700 py-2 hover:text-orange-500 transition-colors"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    window.location.href = '/login';
                  }}
                >
                  Login
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;