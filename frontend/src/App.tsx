import { useState } from 'react'

import './App.css'
import Header from './components/layout/Header'
import HeroSection from './components/layout/HeroSection'
import TopCategories from './components/layout/Top-Category'
import StudentFeedback from './components/layout/StudentFeedback'
import FeaturedCourses from './components/layout/FeatureCourse'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <HeroSection />
      <TopCategories />
      <FeaturedCourses/>
      <StudentFeedback />
    </>
  )
}

export default App
