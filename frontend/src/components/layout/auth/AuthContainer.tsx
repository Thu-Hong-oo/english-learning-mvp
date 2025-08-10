import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthContainer() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleLoginSuccess = () => {
    // Redirect to dashboard or home page
    console.log('Đăng nhập thành công!');
    // window.location.href = '/dashboard';
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
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-2 ">
        <div className='flex justify-end mb-2'>
        <button
              onClick={() => setIsLogin(true)}
              className={`px-6 py-2 rounded-md transition-colors ${
                isLogin 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`px-6 py-2 rounded-md transition-colors ${
                !isLogin 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Đăng ký
            </button>
        </div>
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-lg">
           
          </div>
        </div>

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