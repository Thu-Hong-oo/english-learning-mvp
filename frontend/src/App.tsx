import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAppDispatch } from './store/hooks'
import { initializeAuth } from './store/slices/authSlice'
import { initializeUserData } from './store/slices/userSlice'

// Import components
import Header from './components/layout/Header'
import HeroSection from './components/layout/HeroSection'
import TopCategories from './components/layout/Top-Category'
import FeaturedCourses from './components/layout/FeatureCourse'
import LearnPressAddOns from './components/layout/LearnPressAddOns'
import Statistics from './components/layout/Statistics'
import StudentFeedback from './components/layout/StudentFeedback'
import LatestArticle from './components/layout/LatestArticle'
import Footer from './components/layout/Footer'
import LoginAndRegister from './pages/LoginAndRegisterPage'
import VerifyEmail from './pages/VerifyEmail'
import ReduxDevTools from './components/ReduxDevTools'

export default function App() {
  const dispatch = useAppDispatch();

  // Khởi tạo Redux state từ localStorage khi app khởi động
  useEffect(() => {
    // Khởi tạo authentication state
    dispatch(initializeAuth());
    
    // Khởi tạo user data
    dispatch(initializeUserData());
  }, [dispatch]);

  return (
    <>
      <Routes>
        {/* Trang chủ */}
        <Route
          path="/"
          element={
            <>
              <Header />
              <HeroSection />
              <TopCategories />
              <FeaturedCourses />
              <LearnPressAddOns />
              <Statistics />
              <StudentFeedback />
              <LatestArticle />
              <Footer />
            </>
          }
        />
        
        {/* Trang đăng nhập/đăng ký */}
        <Route path="/login" element={<LoginAndRegister />} />
        
        {/* Trang xác thực email */}
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
      
      {/* Redux DevTools - chỉ hiển thị trong development */}
      <ReduxDevTools />
    </>
  )
}