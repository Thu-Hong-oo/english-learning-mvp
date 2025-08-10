import Header from './components/layout/Header'
import HeroSection from './components/layout/HeroSection'
import TopCategories from './components/layout/Top-Category'
import FeaturedCourses from './components/layout/FeatureCourse'
import LearnPressAddOns from './components/layout/LearnPressAddOns'
import Statistics from './components/layout/Statistics'
import StudentFeedback from './components/layout/StudentFeedback'
import LatestArticle from './components/layout/LatestArticle'
import Footer from './components/layout/Footer'
import { Routes, Route } from 'react-router-dom'
import LoginAndRegister from './pages/LoginAndRegisterPage'
import VerifyEmail from './pages/VerifyEmail'

export default function App() {
  return (
    <>
    
      <Routes>
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
        <Route path="/login" element={<LoginAndRegister />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>
    
    </>
  )
}