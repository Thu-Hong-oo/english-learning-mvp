import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { registerUser, clearError } from '../../../store/slices/authSlice';
import { apiService } from '../../../services/api';

interface RegisterFormProps {
  onSuccess?: (email: string) => void; // callback when register successfully
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // Redux hooks
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(state => state.auth);

  // Xóa lỗi khi component mount
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Google OAuth handler
  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      
      // 1. Lấy Google auth URL từ backend
      const data = await apiService.getGoogleAuthUrl();
      
      if (data.success) {
        // 2. Mở popup window để user authorize Google
        const popup = window.open(
          data.authUrl,
          'googleAuth',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        // 3. Lắng nghe message từ popup
        const messageListener = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
            const { token, user, isNewUser } = event.data;
            
            console.log('Google OAuth Success - Received data:', { token, user, isNewUser });
            
            // Lưu token vào localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            console.log('Stored in localStorage:', {
              token: localStorage.getItem('token'),
              user: localStorage.getItem('user')
            });
            
            // Cập nhật Redux store
            dispatch({
              type: 'auth/googleAuthSuccess',
              payload: { user, token }
            });
            
            console.log('Dispatched to Redux store');
            
            // Đóng popup
            if (popup) popup.close();
            
            // Xóa event listener
            window.removeEventListener('message', messageListener);
            
            // Thông báo thành công
            if (isNewUser) {
              alert(`🎉 Chào mừng ${user.fullName}! Tài khoản đã được tạo thành công với Google.`);
            } else {
              alert(`👋 Chào mừng trở lại ${user.fullName}!`);
            }
            
            // Redirect về homepage
            window.location.href = '/';
          }
        };

        window.addEventListener('message', messageListener);

        // 4. Kiểm tra popup có bị đóng không
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            setGoogleLoading(false);
          }
        }, 1000);

      } else {
        throw new Error('Failed to get Google auth URL');
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      alert('Đăng nhập Google thất bại. Vui lòng thử lại.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return;
    }

    // Dispatch register action
    const result = await dispatch(registerUser({
      username: name.toLowerCase().replace(/\s+/g, ''),
      email,
      password,
      fullName: name
    }));
    
    // Kiểm tra kết quả
    if (registerUser.fulfilled.match(result)) {
      // Đăng ký thành công
      onSuccess?.(email);
    }
    // Nếu thất bại, error sẽ được hiển thị tự động từ Redux state
  };

  const isFormValid = name && email && password && confirmPassword && agreedToTerms && password === confirmPassword;

  return (
    <div className="p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Đăng ký tài khoản
          </CardTitle>
          <CardDescription className="text-gray-600">
            Tạo tài khoản mới để bắt đầu học tiếng Anh
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Google OAuth Button */}
          <div className="mb-6">
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 mb-4"
            >
              {googleLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>Đăng ký với Google</span>
                </div>
              )}
            </Button>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">hoặc</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">
                Họ và tên
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Nhập họ và tên"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Tạo mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-sm text-red-600">Mật khẩu không khớp</p>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1"
                disabled={loading}
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Tôi đồng ý với <a href="#" className="text-orange-500 hover:text-orange-600">Điều khoản sử dụng</a> và <a href="#" className="text-orange-500 hover:text-orange-600">Chính sách bảo mật</a>
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang tạo tài khoản...</span>
                </div>
              ) : (
                'Tạo tài khoản'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
                disabled={loading}
              >
                Đã có tài khoản? Đăng nhập ngay
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}