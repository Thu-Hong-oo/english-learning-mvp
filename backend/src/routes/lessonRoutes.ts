import express from 'express'
import { 
  getTeacherLessons,
  getLessonsByCourse,
  createLesson, 
  updateLesson, 
  deleteLesson,
  toggleLessonStatus
} from '../controllers/lessonController'
import { authenticateToken, authorizeRole } from '../middleware/auth'

const router = express.Router()

// Public routes
router.get('/course/:courseId', getLessonsByCourse)

// Teacher routes (must be before /:id to avoid conflict)
router.get('/teacher', authenticateToken, authorizeRole(['teacher']), getTeacherLessons)

// Protected routes
router.use(authenticateToken)
router.post('/', authorizeRole(['teacher']), createLesson)
router.put('/:id', authorizeRole(['teacher']), updateLesson)
router.delete('/:id', authorizeRole(['teacher']), deleteLesson)
router.patch('/:id/status', authorizeRole(['teacher']), toggleLessonStatus)

export default router
