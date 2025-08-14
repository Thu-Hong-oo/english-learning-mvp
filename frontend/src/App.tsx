import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAppDispatch } from './store/hooks'
import { initializeAuth } from './store/slices/authSlice'
import { initializeUserData } from './store/slices/userSlice'
import { fetchFeaturedCourses } from './store/slices/courseSlice'
import Header from './components/layout/Header'
import HeroSection from './components/layout/HeroSection'
import FeatureCourse from './components/layout/FeatureCourse'
import Statistics from './components/layout/Statistics'
import StudentFeedback from './components/layout/StudentFeedback'
import LatestArticle from './components/layout/LatestArticle'
import LearnPressAddOns from './components/layout/LearnPressAddOns'

import Footer from './components/layout/Footer'
import LoginAndRegister from './pages/LoginAndRegisterPage'
import VerifyEmail from './pages/VerifyEmail'
import GoogleAuthSuccess from './pages/GoogleAuthSuccess'
import GoogleAuthError from './pages/GoogleAuthError'
import CoursePage from './pages/CoursePage'
import CourseListing from './pages/CourseListing'
import BlogPage from './pages/BlogPage'
import AdminDashboard from './pages/AdminDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import CreateCourse from './pages/teacher/CreateCourse'
import TeacherProfile from './pages/teacher/TeacherProfile'
import CreateLesson from './pages/teacher/CreateLesson'
import EditLesson from './pages/teacher/EditLesson'
import CoursePreview from './pages/teacher/CoursePreview'
import EditCourse from './pages/teacher/EditCourse'
import InstructorApplicationPage from './pages/InstructorApplicationPage'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeAuth());
    dispatch(initializeUserData());
    dispatch(fetchFeaturedCourses());
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            <HeroSection />
            <FeatureCourse />
            <Statistics />
            <StudentFeedback />
            <LatestArticle />
            <LearnPressAddOns />
      
            <Footer />
          </>
        } />
        <Route path="/login" element={<LoginAndRegister />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/google-success" element={<GoogleAuthSuccess />} />
        <Route path="/auth/google-error" element={<GoogleAuthError />} />
        <Route path="/course" element={<><Header /><CoursePage /><Footer /></>} />
        <Route path="/course/:id" element={<><Header /><CoursePage /><Footer /></>} />
        <Route path="/course-listing" element={<><Header /><CourseListing /><Footer /></>} />
        <Route path="/blog" element={<><Header /><BlogPage /><Footer /></>} />
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/teacher" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />
        <Route path="/teacher/courses/create" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <CreateCourse />
          </ProtectedRoute>
        } />
        <Route path="/teacher/profile" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherProfile />
          </ProtectedRoute>
        } />
        <Route path="/teacher/courses/:courseId/lessons/create" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <CreateLesson />
          </ProtectedRoute>
        } />
        <Route path="/teacher/courses/:courseId/lessons/:lessonId/edit" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <EditLesson />
          </ProtectedRoute>
        } />
        <Route path="/teacher/courses/:courseId/preview" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <CoursePreview />
          </ProtectedRoute>
        } />
        <Route path="/teacher/courses/:courseId/edit" element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <EditCourse />
          </ProtectedRoute>
        } />
        <Route path="/instructor-application" element={<InstructorApplicationPage />} />
      </Routes>
     
    </>
  )
}