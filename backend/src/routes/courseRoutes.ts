import express from 'express';
import { authenticateToken } from '../middleware/auth';
import Course from '../models/Course';

const router = express.Router();

// GET /api/courses - Get all courses
router.get('/', async (req, res) => {
  try {
    // Get all published courses from database
    const courses = await Course.find({ status: 'published' }).populate('teacher', 'username fullName');
    
    res.json({
      success: true,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/courses/:id - Get course by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get course from database
    const course = await Course.findById(id).populate('teacher', 'username fullName');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
