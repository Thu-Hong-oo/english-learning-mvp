import express from 'express';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET /api/courses - Get all courses
router.get('/', async (req, res) => {
  try {
    // For now, return mock data since we don't have the full course controller
    const mockCourses = [
      {
        _id: '1',
        title: 'English Grammar Fundamentals',
        description: 'Master the basics of English grammar',
        level: 'beginner',
        category: 'grammar',
        thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        duration: 480,
        lessonsCount: 12,
        isPublished: true,
        teacher: 'teacher1',
        lessons: [],
        tags: ['grammar', 'beginner'],
        difficulty: 1,
        rating: 4.5,
        totalStudents: 1250,
        price: 0,
        requirements: ['Basic English knowledge'],
        objectives: ['Understand basic grammar rules'],
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: '2',
        title: 'Advanced Vocabulary Builder',
        description: 'Expand your English vocabulary',
        level: 'advanced',
        category: 'vocabulary',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
        duration: 600,
        lessonsCount: 15,
        isPublished: true,
        teacher: 'teacher2',
        lessons: [],
        tags: ['vocabulary', 'advanced'],
        difficulty: 4,
        rating: 4.8,
        totalStudents: 890,
        price: 29.99,
        requirements: ['Intermediate English level'],
        objectives: ['Master 500+ advanced words'],
        status: 'published',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    res.json({
      success: true,
      data: mockCourses
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
    
    // Mock course data
    const mockCourse = {
      _id: id,
      title: 'Sample Course',
      description: 'This is a sample course',
      level: 'intermediate',
      category: 'general',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      duration: 300,
      lessonsCount: 10,
      isPublished: true,
      teacher: 'teacher1',
      lessons: [],
      tags: ['sample', 'course'],
      difficulty: 2,
      rating: 4.0,
      totalStudents: 500,
      price: 19.99,
      requirements: ['Basic knowledge'],
      objectives: ['Learn new skills'],
      status: 'published',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    res.json({
      success: true,
      data: mockCourse
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
