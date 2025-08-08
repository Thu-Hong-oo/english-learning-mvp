import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

export default function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implement login logic here
      console.log('Login:', { email, password });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle successful login
      // Redirect or update state
      
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (name: string, email: string, password: string, confirmPassword: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // TODO: Implement register logic here
      console.log('Register:', { name, email, password, confirmPassword });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle successful registration
      // Redirect or update state
      
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-2">
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

        {isLogin ? (
          <LoginForm 
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error??undefined}
          />
        ) : (
          <RegisterForm 
            onSubmit={handleRegister}
            isLoading={isLoading}
            error={error??undefined}
          />
        )}
      </div>
    </div>
  );
}