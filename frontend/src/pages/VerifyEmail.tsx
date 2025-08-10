import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiService } from '../services/api';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(location.state?.email || '');

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setMessage('Vui lòng nhập OTP 6 số');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('Đang xác thực...');

    try {
      const response = await apiService.verifyEmail({ otp });

      if (response.success) {
        setStatus('success');
        setMessage('Email đã được xác thực thành công! Bạn có thể đăng nhập ngay bây giờ.');
        
        // Chuyển hướng về trang đăng nhập sau 3 giây
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(response.message || 'Xác thực email thất bại');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Có lỗi xảy ra khi xác thực email');
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      setMessage('Vui lòng nhập email để gửi lại OTP');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage('Đang gửi lại OTP...');

    try {
      const response = await apiService.sendVerification({ email });

      if (response.success) {
        setStatus('success');
        setMessage('OTP mới đã được gửi lại đến email của bạn!');
        setOtp(''); // Reset OTP input
      } else {
        setStatus('error');
        setMessage(response.message || 'Gửi lại OTP thất bại');
      }
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Có lỗi xảy ra khi gửi lại OTP');
    }
  };

  const renderContent = () => {
    switch (status) {
      case 'idle':
        return (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email đăng ký
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email đã đăng ký"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {location.state?.email && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ Email đã được điền sẵn từ quá trình đăng ký
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Mã OTP (6 số)
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Nhập mã OTP 6 số"
                maxLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg font-mono tracking-widest"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Mã OTP đã được gửi đến email của bạn
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Xác thực Email
              </button>
              
              <button
                type="button"
                onClick={handleResendOTP}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
              >
                Gửi lại OTP
              </button>
            </div>
          </form>
        );

      case 'loading':
        return (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Đang xử lý...</h2>
            <p className="text-gray-600">{message}</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Xác thực thành công!</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <button
              onClick={() => navigate('/login')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Đăng nhập ngay
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Có lỗi xảy ra</h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setStatus('idle');
                  setMessage('');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Về đăng nhập
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Xác thực Email</h1>
          <p className="text-gray-600">English Website</p>
        </div>
        
        {renderContent()}

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Không nhận được email? Kiểm tra thư mục spam hoặc{' '}
            <button
              onClick={() => setStatus('idle')}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              thử lại
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
