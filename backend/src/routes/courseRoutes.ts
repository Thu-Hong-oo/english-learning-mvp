
import express from 'express'
import { 
  getAllCourses,
  getCourseById, 
  createCourse, 
  updateCourse, 
  deleteCourse,
  getTeacherCourses,
  toggleCourseStatus
} from '../controllers/courseController'
import { authenticateToken, authorizeRole } from '../middleware/auth'

const router = express.Router()

// Public routes
router.get('/', getAllCourses)

// Teacher routes (must be before /:id to avoid conflict)
router.get('/teacher', authenticateToken, authorizeRole(['teacher']), getTeacherCourses)

// Course by ID route
router.get('/:id', getCourseById)

// Protected routes
router.use(authenticateToken)
router.post('/', authorizeRole(['teacher']), createCourse)
router.put('/:id', authorizeRole(['teacher']), updateCourse)
router.delete('/:id', authorizeRole(['teacher']), deleteCourse)
router.patch('/:id/status', authorizeRole(['teacher']), toggleCourseStatus)

export default router
