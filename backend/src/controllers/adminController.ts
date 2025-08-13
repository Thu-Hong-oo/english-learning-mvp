import { Request, Response } from 'express'
import InstructorApplication from '../models/InstructorApplication'
import User from '../models/User'
import Course from '../models/Course'
import { AuthRequest } from '../middleware/auth'

// ADMIN: List instructor applications
export const listInstructorApplications = async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 10 } = req.query as any
    const filter: any = {}
    if (status) filter.status = status

    const skip = (Number(page) - 1) * Number(limit)
    const [items, total] = await Promise.all([
      InstructorApplication.find(filter)
        .populate('userId', 'username email fullName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      InstructorApplication.countDocuments(filter)
    ])

    res.json({ success: true, data: { items, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } } })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// ADMIN: Review application (approve/reject)
export const reviewInstructorApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { action, notes } = req.body as { action: 'approve' | 'reject'; notes?: string }

    const app = await InstructorApplication.findById(id)
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' })

    app.status = action === 'approve' ? 'approved' : 'rejected'
    app.reviewNotes = notes
    app.reviewedBy = req.user ? (req.user.userId as any) : undefined
    app.reviewedAt = new Date()
    await app.save()

    if (action === 'approve') {
      // Cập nhật role cho user
      if (app.userId) {
        // Nếu có userId, cập nhật trực tiếp
        await User.findByIdAndUpdate(app.userId, { role: 'teacher' })
      } else if (app.email) {
        // Nếu chỉ có email, tìm user theo email và cập nhật
        await User.findOneAndUpdate({ email: app.email }, { role: 'teacher' })
      }
    }

    const message = action === 'approve' 
      ? `Application approved successfully. User role has been updated to teacher.` 
      : `Application rejected successfully.`
    
    res.json({ success: true, message, data: app })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// ADMIN: Manage courses approvals (publish/unpublish)
export const setCourseStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body as { status: 'draft' | 'published' | 'archived' }
    const updated = await Course.findByIdAndUpdate(id, { status }, { new: true })
    if (!updated) return res.status(404).json({ success: false, message: 'Course not found' })
    res.json({ success: true, message: 'Course status updated', data: updated })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}


