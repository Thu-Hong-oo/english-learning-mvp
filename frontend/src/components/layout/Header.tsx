import { useState } from "react";
import { ChevronDown, Search, Menu, X, LogIn, User, LogOut, Settings } from "lucide-react";
import { Button } from '../ui/button';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Redux hooks
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const navigate = useNavigate();

  // Debug logging
  console.log('Header - Current Redux state:', { user, isAuthenticated });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 relative">
      <div className="container mx-auto px-4 lg:px-20">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="logo">
            <button onClick={() => navigate('/')}>
              <img src="/LOGO.png" alt="Logo" className="h-8 w-auto" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="/" className="text-orange-500 font-medium">
              Trang chủ
            </a>
            <a href="/course-listing" className="text-gray-700 hover:text-orange-500 transition-colors">
              Khóa học
            </a>
            <a href="/blog" className="text-gray-700 hover:text-orange-500 transition-colors">
              Bài viết
            </a>
            
           
            <a href="#" className="text-gray-700 hover:text-orange-500 transition-colors">
              Tiện ích LearnPress
            </a>
           
          </nav>

          {/* Desktop Right side */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated && user ? (
              // User đã đăng nhập - Hiển thị user menu
              <div className="relative">
                <Button 
                  variant="ghost" 
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-gray-700 hover:text-orange-500"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user.fullName || user.username}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                      {/* <p className="text-sm text-gray-500">{user.email}</p> */}
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        // Có thể navigate đến profile page sau này
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Hồ sơ
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        // Có thể navigate đến settings page sau này
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Cài đặt
                    </button>
                    
                    <div className="border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // User chưa đăng nhập - Hiển thị nút Login
              <Button 
                variant="ghost" 
                onClick={handleLogin}
                className="text-gray-700 font-bold hover:text-orange-500"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Đăng nhập
              </Button>
            )}
            
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
                Trang chủ
              </a>
              <a 
                href="#" 
                className="block text-gray-700 hover:text-orange-500 py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Khóa học
              </a>
              <a 
                href="#" 
                className="block text-gray-700 hover:text-orange-500 py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Bài viết
              </a>
             
              <a 
                href="#" 
                className="block text-gray-700 hover:text-orange-500 py-2 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tiện ích LearnPress
              </a>
              
              {/* Mobile Login/User Menu */}
              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <div className="px-2 py-1">
                      <p className="text-sm font-medium text-gray-900">{user.fullName || user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <button 
                      className="block text-gray-700 py-2 hover:text-orange-500 transition-colors"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        // Có thể navigate đến profile page sau này
                      }}
                    >
                      Hồ sơ
                    </button>
                    <button 
                      className="block text-gray-700 py-2 hover:text-orange-500 transition-colors"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        // Có thể navigate đến settings page sau này
                      }}
                    >
                      Cài đặt
                    </button>
                    <button 
                      className="block text-red-600 py-2 hover:text-red-700 transition-colors"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                ) : (
                  <button 
                    className="block text-gray-700 py-2 hover:text-orange-500 transition-colors"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogin();
                    }}
                  >
                    Đăng nhập
                  </button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;