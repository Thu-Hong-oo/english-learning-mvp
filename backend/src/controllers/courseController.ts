import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Course from '../models/Course'
import { AuthRequest } from '../middleware/auth'

// Get all courses (public)
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, category, level, search } = req.query
    
    const query: any = { status: 'published' }
    
    if (category) query.category = category
    if (level) query.level = level
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    const courses = await Course.find(query)
      .populate('teacher', 'fullName email avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))

    const total = await Course.countDocuments(query)

    res.json({
      success: true,
      data: {
        items: courses,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Get course by ID (public)
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    
    const course = await Course.findById(id)
      .populate('teacher', 'fullName email avatar bio expertise')
      .populate('lessons')

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }

    res.json({
      success: true,
      data: course
    })
  } catch (error) {
    console.error('Error fetching course:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Create course (teacher only)
export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user?.userId
    
    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const {
      title,
      description,
      price,
      category,
      level,
      duration,
      thumbnail,
      tags,
      requirements,
      objectives
    } = req.body

    // Validate required fields
    if (!title || !description || !category || !level) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, and level are required'
      })
    }

    const course = await Course.create({
      title,
      description,
      price: price || 0,
      category,
      level,
      duration: duration || 0,
      thumbnail,
      tags: tags || [],
      requirements: requirements || [],
      objectives: objectives || [],
      teacher: teacherId,
      createdBy: teacherId, // Set createdBy to teacherId
      status: 'draft'
    })

    const populatedCourse = await Course.findById(course._id)
      .populate('teacher', 'fullName email avatar')

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: populatedCourse
    })
  } catch (error) {
    console.error('Error creating course:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Update course (teacher only)
export const updateCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const teacherId = req.user?.userId
    
    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const course = await Course.findById(id)
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }

    // Check if teacher owns this course
    if (course.teacher.toString() !== teacherId) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    ).populate('teacher', 'fullName email avatar')

    res.json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse
    })
  } catch (error) {
    console.error('Error updating course:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Delete course (teacher only)
export const deleteCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const teacherId = req.user?.userId
    
    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const course = await Course.findById(id)
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }

    // Check if teacher owns this course
    if (course.teacher.toString() !== teacherId) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    await Course.findByIdAndDelete(id)

    res.json({
      success: true,
      message: 'Course deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting course:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Get teacher's courses
export const getTeacherCourses = async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user?.userId
    
    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const courses = await Course.find({ teacher: teacherId })
      .populate('teacher', 'fullName email avatar')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: courses
    })
  } catch (error) {
    console.error('Error fetching teacher courses:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Publish/Unpublish course (teacher only)
export const toggleCourseStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body
    const teacherId = req.user?.userId
    
    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    if (!['draft', 'published', 'archived'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' })
    }

    const course = await Course.findById(id)
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }

    // Check if teacher owns this course
    if (course.teacher.toString() !== teacherId) {
      return res.status(403).json({ success: false, message: 'Forbidden' })
    }

    // Teacher can only publish if admin has approved
    if (status === 'published' && course.adminApproval !== 'approved') {
      return res.status(400).json({ 
        success: false, 
        message: 'Course must be approved by admin before publishing' 
      })
    }

    course.status = status
    await course.save()

    res.json({
      success: true,
      message: `Course ${status} successfully`,
      data: course
    })
  } catch (error) {
    console.error('Error toggling course status:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Admin approve/reject course
export const adminApproveCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { action, reason } = req.body // action: 'approve' or 'reject'
    const adminId = req.user?.userId
    
    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Invalid action' })
    }

    const course = await Course.findById(id)
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' })
    }

    if (action === 'approve') {
      course.adminApproval = 'approved'
      course.adminApprovedBy = new mongoose.Types.ObjectId(adminId)
      course.adminApprovedAt = new Date()
      course.adminRejectionReason = undefined
    } else {
      course.adminApproval = 'rejected'
      course.adminRejectionReason = reason || 'No reason provided'
      course.adminApprovedBy = undefined
      course.adminApprovedAt = undefined
    }

    await course.save()

    res.json({
      success: true,
      message: `Course ${action}d successfully`,
      data: course
    })
  } catch (error) {
    console.error('Error approving course:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Get all courses for admin
export const getAllCoursesForAdmin = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.userId
    
    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const courses = await Course.find({})
      .populate('teacher', 'fullName email username')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: courses
    })
  } catch (error) {
    console.error('Error fetching all courses for admin:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Get pending courses for admin
export const getPendingCourses = async (req: AuthRequest, res: Response) => {
  try {
    const adminId = req.user?.userId
    
    if (!adminId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const courses = await Course.find({ adminApproval: 'pending' })
      .populate('teacher', 'fullName email')
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: courses
    })
  } catch (error) {
    console.error('Error fetching pending courses:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
