import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Eye, EyeOff, Mail, Lock, Chrome } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginUser, clearError } from '../../../store/slices/authSlice';
import { apiService } from '../../../services/api';
interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  
  // Redux hooks
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  // Chuyển hướng về trang chủ nếu đã đăng nhập
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Xóa lỗi khi component mount hoặc khi error thay đổi
  useEffect(() => {
    dispatch(clearError());
    setLocalError('');
  }, [dispatch]);

  // Xử lý lỗi từ Redux state
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset local error
    setLocalError('');
    
    // Dispatch login action
    const result = await dispatch(loginUser({ email, password }));
    
    // Kiểm tra kết quả
    if (loginUser.fulfilled.match(result)) {
      // Đăng nhập thành công
      setLocalError(''); // Clear any previous errors
      console.log('Login successful, redirecting...');
      onSuccess?.();
      
     
      const user = result.payload.user;
      if (user && user.role === 'admin') {
        console.log('Admin user detected, redirecting to dashboard...');
        navigate('/admin');
      } else if (user && user.role === 'teacher') {
        console.log('Teacher user detected, redirecting to teacher dashboard...');
        navigate('/teacher'); // Hoặc '/dashboard' tùy bạn muốn
      } else {
        // Student user
        console.log('Student user detected, redirecting to homepage...');
        navigate('/');
      }
    } else if (loginUser.rejected.match(result)) {
      // Đăng nhập thất bại - error sẽ được hiển thị từ Redux state
      console.log('Login failed:', result.payload);
      // Không cần set localError vì Redux state đã có error
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Lấy Google auth URL từ backend
      const data = await apiService.getGoogleAuthUrl();
      
      if (data.success && data.authUrl) {
        // Chuyển hướng đến Google OAuth
        window.location.href = data.authUrl;
      } else {
        setLocalError('Không thể kết nối với Google. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setLocalError('Có lỗi xảy ra khi đăng nhập với Google.');
    }
  };

  const handleInstructorApplication = () => {
    console.log('Instructor application clicked, navigating to application page...');
    navigate('/instructor-application');
  };

  return (
    <div className="p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Đăng nhập
          </CardTitle>
          <CardDescription className="text-gray-600">
            Chào mừng bạn quay trở lại! Vui lòng đăng nhập để tiếp tục.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="Nhập mật khẩu"
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

            {(localError || error) && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{localError || error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                'Đăng nhập'
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Hoặc</span>
              </div>
            </div>

            {/* Google Login Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full border-gray-300 hover:bg-gray-50"
              disabled={loading}
            >
               <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
             
              Đăng nhập với Google
            </Button>

            {/* Instructor Application Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleInstructorApplication}
              className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
              disabled={loading}
            >
              <Mail className="w-4 h-4 mr-2" />
              Đăng ký làm giảng viên
            </Button>

            <div className="text-center space-y-2">
              <a href="#" className="text-sm text-orange-500 hover:text-orange-600 block">
                Quên mật khẩu?
              </a>
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
                disabled={loading}
              >
                Chưa có tài khoản? Đăng ký ngay
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}