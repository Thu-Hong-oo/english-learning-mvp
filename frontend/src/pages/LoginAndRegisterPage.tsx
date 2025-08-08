import AuthContainer from '@/components/layout/auth/AuthContainer'
import React from 'react'

const LoginAndRegister = () => {
  return (
    <div className="flex min-h-screen">
    {/*Left-Image*/}
    <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center bg-orange-200">
      <img
        src="/language.png"
        alt="Login Illustration"
        className="max-w-md"
      />
    </div>

   {/*Right-form*/}
   <div className="w-full md:w-1/2 flex items-center justify-center p-4">
   <AuthContainer/>

   </div>
 
  
  </div>
  )
}

export default LoginAndRegister
