import { useState } from 'react'

import './App.css'
import Header from './components/layout/Header'
import HeroSection from './components/layout/HeroSection'
import TopCategories from './components/layout/Top-Category'
import StudentFeedback from './components/layout/StudentFeedback'
import FeaturedCourses from './components/layout/FeatureCourse'
import Footer from './components/layout/Footer'
import LatestArticle from './components/layout/LatestArticle'
import LearnPressAddOns from './components/layout/LearnPressAddOns'
import Statistics from './components/layout/Statistics'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <HeroSection />
      <TopCategories />
      <FeaturedCourses/>
      <LearnPressAddOns/>
      <Statistics/>
      <StudentFeedback />
      <LatestArticle/>
      <Footer/>
    </>
  )
}

export default App
