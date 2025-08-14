import { Request, Response } from 'express';
import Lesson from '../models/Lesson';
import Course from '../models/Course';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

export const getLessonsByTeacher = async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user?.userId;
    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const lessons = await Lesson.find({ teacher: teacherId })
      .populate('course', 'title')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: lessons });
  } catch (error) {
    console.error('Error fetching lessons by teacher:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


// Create lesson
export const createLesson = async (req: AuthRequest, res: Response) => {
  try {
    const teacherId = req.user?.userId;
    const { course: courseId, title, description, content, duration, type, order, videoUrl, audioUrl } = req.body;

    console.log('Creating lesson with data:', { courseId, title, type, videoUrl, audioUrl });
    console.log('Teacher ID:', teacherId);

    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Validate required fields
    if (!title || !description || !content || !duration || !type || !order) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, content, duration, type, and order are required'
      });
    }

    // Validate media URLs based on type
    if (type === 'video' && !videoUrl) {
      return res.status(400).json({
        success: false,
        message: 'Video URL is required for video lessons'
      });
    }

    if (type === 'audio' && !audioUrl) {
      return res.status(400).json({
        success: false,
        message: 'Audio URL is required for audio lessons'
      });
    }

    // Check if course exists and belongs to teacher
    const course = await Course.findOne({ _id: courseId, teacher: teacherId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or you do not have permission to add lessons to this course'
      });
    }

    // Create lesson
    const lesson = new Lesson({
      title,
      description,
      content,
      duration,
      type,
      order,
      course: courseId,
      teacher: teacherId,
      status: 'draft',
      videoUrl: type === 'video' ? videoUrl : undefined,
      audioUrl: type === 'audio' ? audioUrl : undefined
    });

    const savedLesson = await lesson.save();

    // Update course lessons count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { lessonsCount: 1 },
      $push: { lessons: savedLesson._id }
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: savedLesson
    });
  } catch (error) {
    console.error('Error creating lesson:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get lesson by ID
export const getLessonById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const teacherId = req.user?.userId;

    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // ✅ Kiểm tra ID hợp lệ
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid lesson ID' });
    }

    const lesson = await Lesson.findOne({ _id: id, teacher: teacherId })
      .populate('course', 'title');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    res.json({ success: true, data: lesson });
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get lessons by course (for students - only published lessons)
export const getLessonsByCoursePublic = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;

    // Check if course exists
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Only return published lessons for students
    const lessons = await Lesson.find({ 
      course: courseId, 
      status: 'published' 
    }).sort({ order: 1 });

    res.json({
      success: true,
      data: lessons
    });
  } catch (error) {
    console.error('Error fetching public lessons:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get lessons by course
export const getLessonsByCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const teacherId = req.user?.userId;

    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Check if course belongs to teacher
    const course = await Course.findOne({ _id: courseId, teacher: teacherId });
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found or you do not have permission to view lessons'
      });
    }

    const lessons = await Lesson.find({ course: courseId, teacher: teacherId })
      .sort({ order: 1 });

    res.json({
      success: true,
      data: lessons
    });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update lesson
export const updateLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const teacherId = req.user?.userId;
    const updateData = req.body;

    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Check if lesson exists and belongs to teacher
    const lesson = await Lesson.findOne({ _id: id, teacher: teacherId });
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found or you do not have permission to edit this lesson'
      });
    }

    // Update lesson
    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Lesson updated successfully',
      data: updatedLesson
    });
  } catch (error) {
    console.error('Error updating lesson:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete lesson
export const deleteLesson = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const teacherId = req.user?.userId;

    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Check if lesson exists and belongs to teacher
    const lesson = await Lesson.findOne({ _id: id, teacher: teacherId });
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found or you do not have permission to delete this lesson'
      });
    }

    // Delete lesson
    await Lesson.findByIdAndDelete(id);

    // Update course lessons count
    await Course.findByIdAndUpdate(lesson.course, {
      $inc: { lessonsCount: -1 },
      $pull: { lessons: id }
    });

    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Publish/Unpublish lesson
export const toggleLessonStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const teacherId = req.user?.userId;

    if (!teacherId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Check if lesson exists and belongs to teacher
    const lesson = await Lesson.findOne({ _id: id, teacher: teacherId });
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found or you do not have permission to edit this lesson'
      });
    }

    // Toggle status between 'draft' and 'published'
    const newStatus = lesson.status === 'draft' ? 'published' : 'draft';
    
    // Update lesson status
    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: `Bài học đã ${newStatus === 'published' ? 'xuất bản' : 'chuyển về bản nháp'} thành công`,
      data: updatedLesson
    });
  } catch (error) {
    console.error('Error toggling lesson status:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
