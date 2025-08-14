import express from 'express';
import { 
  createLesson,
  getLessonById,
  updateLesson,
  deleteLesson,
  getLessonsByCourse
} from '../controllers/lessonController';
import { authenticateToken, authorizeRole } from '../middleware/auth';

const router = express.Router();

// Protected routes
router.use(authenticateToken);

// Teacher routes
router.post('/', authorizeRole(['teacher']), createLesson);
router.get('/course/:courseId', authorizeRole(['teacher']), getLessonsByCourse);
router.get('/:id', authorizeRole(['teacher']), getLessonById);
router.put('/:id', authorizeRole(['teacher']), updateLesson);
router.delete('/:id', authorizeRole(['teacher']), deleteLesson);

export default router;
