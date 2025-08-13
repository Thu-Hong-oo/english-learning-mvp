import { Response, Request } from 'express'
import InstructorApplication from '../models/InstructorApplication'
import { AuthRequest } from '../middleware/auth'

// Submit instructor application (public - no auth required)
export const submitPublicApplication = async (req: Request, res: Response) => {
  try {
    const { fullName, bio, expertise, experienceYears, portfolioUrl, attachments, email } = req.body

    // Validate required fields
    if (!fullName || !bio || !expertise || !experienceYears || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc' 
      })
    }

    // Check if email already has an application
    const existing = await InstructorApplication.findOne({ 
      email, 
      status: { $in: ['pending', 'approved'] } 
    })
    
    if (existing) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email này đã có đơn đăng ký đang chờ duyệt hoặc đã được duyệt' 
      })
    }

    const app = await InstructorApplication.create({
      email,
      fullName,
      bio,
      expertise,
      experienceYears,
      portfolioUrl,
      attachments,
      status: 'pending'
    })

    res.status(201).json({ 
      success: true, 
      message: 'Đơn đăng ký đã được gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.', 
      data: app 
    })
  } catch (err) {
    console.error('Error submitting application:', err)
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra khi gửi đơn. Vui lòng thử lại.' })
  }
}

// Submit instructor application (authenticated users)
export const submitApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' })
    const { fullName, bio, expertise, experienceYears, portfolioUrl, attachments } = req.body

    const existing = await InstructorApplication.findOne({ userId: req.user.userId, status: { $in: ['pending', 'approved'] } })
    if (existing) {
      return res.status(400).json({ success: false, message: 'You already have an active or approved application' })
    }

    const app = await InstructorApplication.create({
      userId: req.user.userId,
      fullName,
      bio,
      expertise,
      experienceYears,
      portfolioUrl,
      attachments,
    })

    res.status(201).json({ success: true, message: 'Application submitted', data: app })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// View my application status
export const myApplication = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' })
    const app = await InstructorApplication.findOne({ userId: req.user.userId }).sort({ createdAt: -1 })
    res.json({ success: true, data: app })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}


