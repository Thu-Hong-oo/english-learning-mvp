import { Request, Response } from 'express'
import Lesson from '../models/Lesson'
import { AuthRequest } from '../middleware/auth'

// Get teacher's lessons
export const getTeacherLessons = async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user?.userId
    
    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const lessons = await Lesson.find({ teacher: teacherId })
      .populate('course', 'title')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: lessons
    })
  } catch (error) {
    console.error('Error fetching teacher lessons:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Get lessons by course
export const getLessonsByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params
    
    const lessons = await Lesson.find({ course: courseId, status: 'published' })
      .sort({ order: 1 })

    res.json({
      success: true,
      data: lessons
    })
  } catch (error) {
    console.error('Error fetching course lessons:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Create lesson
export const createLesson = async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user?.userId
    
    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const {
      title,
      description,
      content,
      duration,
      type,
      order,
      course,
      videoUrl,
      audioUrl,
      attachments
    } = req.body

    // Validate required fields
    if (!title || !description || !content || !duration || !type || !order || !course) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, content, duration, type, order, and course are required'
      })
    }

    const lesson = await Lesson.create({
      title,
      description,
      content,
      duration,
      type,
      order,
      course,
      teacher: teacherId,
      videoUrl,
      audioUrl,
      attachments: attachments || [],
      status: 'draft'
    })

    const populatedLesson = await Lesson.findById(lesson._id)
      .populate('course', 'title')

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: populatedLesson
    })
  } catch (error) {
    console.error('Error creating lesson:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Update lesson
export const updateLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const teacherId = req.user?.userId
    
    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const lesson = await Lesson.findById(id)
    
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' })
    }

    // Check if teacher owns this lesson
    if (lesson.teacher.toString() !== teacherId) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).populate('course', 'title')

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      data: updatedLesson
    })
  } catch (error) {
    console.error('Error updating lesson:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Delete lesson
export const deleteLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const teacherId = req.user?.userId
    
    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const lesson = await Lesson.findById(id)
    
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' })
    }

    // Check if teacher owns this lesson
    if (lesson.teacher.toString() !== teacherId) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    await Lesson.findByIdAndDelete(id)

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting lesson:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Publish/Unpublish lesson
export const toggleLessonStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const teacherId = req.user?.userId
    
    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    if (!['draft', 'published'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    const lesson = await Lesson.findById(id)
    
    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' })
    }

    // Check if teacher owns this lesson
    if (lesson.teacher.toString() !== teacherId) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    lesson.status = status
    await lesson.save()

    res.json({
      success: true,
      message: `Lesson ${status} successfully`,
      data: lesson
    })
  } catch (error) {
    console.error('Error toggling lesson status:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
