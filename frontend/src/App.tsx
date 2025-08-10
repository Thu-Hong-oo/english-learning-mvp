import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAppDispatch } from './store/hooks'
import { initializeAuth } from './store/slices/authSlice'
import { initializeUserData } from './store/slices/userSlice'
import { fetchFeaturedCourses } from './store/slices/courseSlice'
import Header from './components/layout/Header'
import HeroSection from './components/layout/HeroSection'
import FeatureCourse from './components/layout/FeatureCourse'
// import TopCategory from './components/layout/TopCategory'
import Statistics from './components/layout/Statistics'
import StudentFeedback from './components/layout/StudentFeedback'
import LatestArticle from './components/layout/LatestArticle'
import LearnPressAddOns from './components/layout/LearnPressAddOns'
import CallToAction from './components/layout/CallToAction'
import Footer from './components/layout/Footer'
import LoginAndRegister from './pages/LoginAndRegisterPage'
import VerifyEmail from './pages/VerifyEmail'
import GoogleAuthSuccess from './pages/GoogleAuthSuccess'
import GoogleAuthError from './pages/GoogleAuthError'


export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
    dispatch(initializeUserData());
    dispatch(fetchFeaturedCourses());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            <HeroSection />
            <FeatureCourse />
            {/* <TopCategory /> */}
            <Statistics />
            <StudentFeedback />
            <LatestArticle />
            <LearnPressAddOns />
            <CallToAction />
            <Footer />
          </>
        } />
        <Route path="/login" element={<LoginAndRegister />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/google-success" element={<GoogleAuthSuccess />} />
        <Route path="/auth/google-error" element={<GoogleAuthError />} />
      </Routes>
     
    </>
  )
}