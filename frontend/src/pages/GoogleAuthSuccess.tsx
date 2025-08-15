import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { googleAuthSuccess } from '@/store/slices/authSlice';

export default function GoogleAuthSuccess() {
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = searchParams.get('token');
    const isNewUser = searchParams.get('isNewUser') === 'true';
    const userStr = searchParams.get('user');

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        
        // Lưu token và user vào localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Dispatch action để cập nhật Redux store
        dispatch(googleAuthSuccess({ token, user }));
        
        // Gửi message về parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'GOOGLE_AUTH_SUCCESS',
            token,
            user,
            isNewUser
          }, window.location.origin);
          
          // Đóng popup sau 1 giây
          setTimeout(() => {
            window.close();
          }, 1000);
        } else {
          // Nếu không có parent window, kiểm tra role và redirect phù hợp
          if (user && user.role === 'admin') {
            console.log('Admin user detected, redirecting to dashboard...');
            window.location.href = '/admin';
          } else {
            // Redirect về homepage cho user thường
            window.location.href = '/';
          }
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Redirect về error page
        window.location.href = '/auth/google-error?error=Invalid user data';
      }
    } else {
      // Redirect về error page nếu thiếu data
      window.location.href = '/auth/google-error?error=Missing authentication data';
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-green-500">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Xác thực thành công!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Đang xử lý thông tin đăng nhập...
          </p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
