import { Request, Response } from 'express';
import Course, { ICourse } from '../models/Course';
import { AuthRequest } from '../middleware/auth';

// GET /api/courses - Lấy danh sách khóa học
export const getCourses = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 10, category, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        // Build filter
        const filter: any = {};
        if (category) filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort
        const sort: any = {};
        sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

        // Pagination
        const skip = (Number(page) - 1) * Number(limit);

        const courses = await Course.find(filter)
            .populate('teacher', 'username fullName avatar')
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .select('-__v');

        const total = await Course.countDocuments(filter);

        res.json({
            success: true,
            data: {
                courses,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });

    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// GET /api/courses/:id - Lấy chi tiết khóa học
export const getCourseById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id)
            .populate('teacher', 'username fullName avatar')
            .populate('lessons', 'title description duration')
            .select('-__v');

        if (!course) {
            res.status(404).json({
                success: false,
                message: 'Course not found'
            });
            return;
        }

        res.json({
            success: true,
            data: course
        });

    } catch (error) {
        console.error('Get course by id error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// POST /api/courses - Tạo khóa học mới (teacher/admin)
export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, category, price, thumbnail, requirements, objectives } = req.body;
        const teacherId = req.user?.userId;

        if (!teacherId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }

        // Check if user is teacher or admin
        if (req.user?.role !== 'teacher' && req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'Only teachers and admins can create courses'
            });
            return;
        }

        const course = new Course({
            title,
            description,
            category,
            price: price || 0,
            thumbnail,
            requirements,
            objectives,
            teacher: teacherId
        });

        await course.save();

        const populatedCourse = await Course.findById(course._id)
            .populate('teacher', 'username fullName avatar')
            .select('-__v');

        res.status(201).json({
            success: true,
            message: 'Course created successfully',
            data: populatedCourse
        });

    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// PUT /api/courses/:id - Cập nhật khóa học
export const updateCourse = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, description, category, price, thumbnail, requirements, objectives, status } = req.body;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }

        const course = await Course.findById(id);

        if (!course) {
            res.status(404).json({
                success: false,
                message: 'Course not found'
            });
            return;
        }

        // Check if user is the teacher or admin
        if (course.teacher.toString() !== userId && req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'You can only update your own courses'
            });
            return;
        }

        const updateData: any = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (category) updateData.category = category;
        if (price !== undefined) updateData.price = price;
        if (thumbnail) updateData.thumbnail = thumbnail;
        if (requirements) updateData.requirements = requirements;
        if (objectives) updateData.objectives = objectives;
        if (status) updateData.status = status;

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        )
        .populate('teacher', 'username fullName avatar')
        .select('-__v');

        res.json({
            success: true,
            message: 'Course updated successfully',
            data: updatedCourse
        });

    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// DELETE /api/courses/:id - Xóa khóa học
export const deleteCourse = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }

        const course = await Course.findById(id);

        if (!course) {
            res.status(404).json({
                success: false,
                message: 'Course not found'
            });
            return;
        }

        // Check if user is the teacher or admin
        if (course.teacher.toString() !== userId && req.user?.role !== 'admin') {
            res.status(403).json({
                success: false,
                message: 'You can only delete your own courses'
            });
            return;
        }

        await Course.findByIdAndDelete(id);

        res.json({
            success: true,
            message: 'Course deleted successfully'
        });

    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// GET /api/courses/:courseId/lessons - Lấy danh sách bài học
export const getCourseLessons = async (req: Request, res: Response): Promise<void> => {
    try {
        const { courseId } = req.params;
        const { page = 1, limit = 10 } = req.query;

        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({
                success: false,
                message: 'Course not found'
            });
            return;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const lessons = await Course.findById(courseId)
            .populate({
                path: 'lessons',
                options: {
                    skip,
                    limit: Number(limit),
                    sort: { order: 1 }
                },
                select: 'title description duration order thumbnail'
            })
            .select('lessons');

        const total = course.lessons.length;

        res.json({
            success: true,
            data: {
                lessons: lessons?.lessons || [],
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });

    } catch (error) {
        console.error('Get course lessons error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
