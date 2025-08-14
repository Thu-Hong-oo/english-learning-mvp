import express from 'express';
import { 
  createLesson,
  getLessonById,
  updateLesson,
  deleteLesson,
  getLessonsByCourse,
  getLessonsByTeacher,
  getLessonsByCoursePublic,
  toggleLessonStatus
} from '../controllers/lessonController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Public routes (no authentication required)
router.get('/course/:courseId/public', getLessonsByCoursePublic); // Public route for students

// Protected routes (authentication required)
router.use(authenticateToken);

// Teacher routes - Specific routes must come before parameterized routes
router.post('/', authorizeRole(['teacher']), createLesson);
router.get('/teacher', authorizeRole(['teacher']), getLessonsByTeacher);
router.get('/course/:courseId', authorizeRole(['teacher']), getLessonsByCourse);
router.patch('/:id/toggle-status', authorizeRole(['teacher']), toggleLessonStatus); // Toggle lesson status
router.get('/:id', authorizeRole(['teacher']), getLessonById);
router.put('/:id', authorizeRole(['teacher']), updateLesson);
router.delete('/:id', authorizeRole(['teacher']), deleteLesson);

export default router;
