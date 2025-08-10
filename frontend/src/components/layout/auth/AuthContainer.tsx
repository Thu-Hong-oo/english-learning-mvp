import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../store/hooks';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthContainer() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  // Redux state
  const { isAuthenticated } = useAppSelector(state => state.auth);

  // Chuyển hướng về trang chủ nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLoginSuccess = () => {
    // LoginForm sẽ tự động chuyển hướng về trang chủ
    console.log('Đăng nhập thành công!');
  };

  const handleRegisterSuccess = (email: string) => {
    setShowSuccessMessage(true);
    // Chuyển hướng đến trang xác thực email sau 2 giây
    setTimeout(() => {
      setShowSuccessMessage(false);
      navigate('/verify-email', { state: { email } });
    }, 2000);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
    setShowSuccessMessage(false);
  };

  const handleSwitchToRegister = () => {
    setIsLogin(false);
    setShowSuccessMessage(false);
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-2">
        
        {/* Logo area */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <img src="/LOGO.png" alt="Logo" className="h-10 w-auto" />
          </div>
        </div>

        {/* Content */}
        {showSuccessMessage ? (
          <div className="text-center p-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto">
              <div className="text-green-600 text-6xl mb-4">✓</div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Đăng ký thành công!
              </h3>
              <p className="text-green-600">
                Vui lòng kiểm tra email và xác thực tài khoản. Bạn sẽ được chuyển đến trang xác thực email trong giây lát...
              </p>
            </div>
          </div>
        ) : isLogin ? (
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onSwitchToRegister={handleSwitchToRegister}
          />
        ) : (
          <RegisterForm 
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </div>
    </div>
  );
}