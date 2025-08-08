import React from "react";
import { ChevronDown, Search } from "lucide-react";
import {Button} from '../ui/button';
const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="logo">
            <img src="/LOGO.png" alt="" />
          </div>
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-orange-500 font-medium">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500">
              Courses
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500">
              Blog
            </a>
            <div className="flex items-center space-x-1">
              <a href="#" className="text-gray-700 hover:text-orange-500">
                Page
              </a>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
            <a href="#" className="text-gray-700 hover:text-orange-500">
              LearnPress Add-On
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500">
              Premium Theme
            </a>
          </nav>
 {/* Right side */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Login / Register</span>
            <Button variant="ghost" size="sm">
              <Search className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
