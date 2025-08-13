import { Response, Request } from 'express'
import InstructorApplication from '../models/InstructorApplication'
import User from '../models/User'
import { AuthRequest } from '../middleware/auth'

// Submit instructor application (public - no auth required)
export const submitPublicApplication = async (req: Request, res: Response) => {
  try {
    const { 
      fullName, bio, expertise, experienceYears, portfolioUrl, attachments, 
      email, password, confirmPassword, phone, dateOfBirth, education,
      certifications, linkedinUrl, teachingExperience, preferredSubjects, availability
    } = req.body

    // Validate required fields
    if (!fullName || !bio || !expertise || !experienceYears || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc' 
      })
    }

    // Validate password
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu phải có ít nhất 6 ký tự' 
      })
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu xác nhận không khớp' 
      })
    }

    // Check if email already exists in User collection
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc sử dụng email khác.' 
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

    // Create user account with email verification
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
      username: email.split('@')[0], // Use email prefix as username
      email,
      password: hashedPassword,
      fullName,
      role: 'student', // Will be updated to 'teacher' when approved
      isEmailVerified: false, // Require email verification
      isActive: true,
      authProvider: 'local',
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined
    });

    // Generate email verification OTP
    const verificationOTP = user.generateEmailVerificationOTP();
    await user.save();

    // Send verification email
    try {
      const { sendVerificationEmail } = require('../services/emailService');
      await sendVerificationEmail(user.email, user.username, verificationOTP);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue with registration even if email fails
    }

    // Create instructor application with extended fields
    const app = await InstructorApplication.create({
      userId: user._id,
      email,
      fullName,
      bio,
      expertise,
      experienceYears,
      portfolioUrl,
      attachments,
      education,
      certifications: certifications || [],
      linkedinUrl,
      teachingExperience,
      preferredSubjects: preferredSubjects || [],
      availability,
      phone,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      status: 'pending'
    })

    res.status(201).json({ 
      success: true, 
      message: 'Đơn đăng ký đã được gửi thành công! Vui lòng kiểm tra email để xác thực tài khoản trước khi đăng nhập.', 
      data: { application: app, user: { email: user.email, fullName: user.fullName } }
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


