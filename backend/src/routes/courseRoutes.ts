import express from 'express';
import { authenticateToken } from '../middleware/auth';
import {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseLessons
} from '../controllers/courseController';

const router = express.Router();

// Public routes
router.get('/', getCourses);
router.get('/:id', getCourseById);
router.get('/:courseId/lessons', getCourseLessons);

// Protected routes (require authentication)
router.post('/', authenticateToken, createCourse);
router.put('/:id', authenticateToken, updateCourse);
router.delete('/:id', authenticateToken, deleteCourse);

export default router;
