import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { apiService } from '../../../services/api';
import type { LoginRequest } from '../../../services/api';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const loginData: LoginRequest = { email, password };
      const response = await apiService.login(loginData);

      if (response.success) {
        // Lưu token và user info
        if (response.token) {
          apiService.setAuthToken(response.token);
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          }
        }
        
        setError('');
        onSuccess?.();
      } else {
        if (response.code === 'EMAIL_NOT_VERIFIED') {
          setError('Email chưa được xác thực. Vui lòng kiểm tra email và xác thực trước khi đăng nhập.');
        } else {
          setError(response.message || 'Đăng nhập thất bại');
        }
      }
    } catch (error: any) {
      setError(error.message || 'Có lỗi xảy ra khi đăng nhập');
    } finally {
      setIsLoading(false);
    }
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
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang đăng nhập...</span>
                </div>
              ) : (
                'Đăng nhập'
              )}
            </Button>

            <div className="text-center space-y-2">
              <a href="#" className="text-sm text-orange-500 hover:text-orange-600 block">
                Quên mật khẩu?
              </a>
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="text-sm text-gray-600 hover:text-gray-800 underline"
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