import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/layout/Header'
import HeroSection from './components/layout/HeroSection'
import TopCategories from './components/layout/Top-Category'
function App() {
  const [count, setCount] = useState(0)

  return (
<>
      <Header/>
      <HeroSection/>
      <TopCategories/>
    </>
  )
}

export default App
