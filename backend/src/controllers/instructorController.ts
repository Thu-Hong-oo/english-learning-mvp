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

    // Detailed validation with specific error messages
    const errors = [];

    // Required fields validation
    if (!fullName || (typeof fullName === 'string' && fullName.trim().length === 0)) {
      errors.push('Họ và tên là bắt buộc');
    }
    
    if (!bio || (typeof bio === 'string' && bio.trim().length === 0)) {
      errors.push('Giới thiệu bản thân là bắt buộc');
    }
    
    if (!expertise || (typeof expertise === 'string' && expertise.trim().length === 0)) {
      errors.push('Chuyên môn là bắt buộc');
    }
    
    if (!experienceYears && experienceYears !== 0) {
      errors.push('Số năm kinh nghiệm là bắt buộc');
    }
    
    if (!email || (typeof email === 'string' && email.trim().length === 0)) {
      errors.push('Email là bắt buộc');
    } else if (typeof email === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Email không hợp lệ');
    }
    
    if (!password || (typeof password === 'string' && password.length === 0)) {
      errors.push('Mật khẩu là bắt buộc');
    } else if (typeof password === 'string' && password.length < 6) {
      errors.push('Mật khẩu phải có ít nhất 6 ký tự');
    }
    
    if (!confirmPassword || (typeof confirmPassword === 'string' && confirmPassword.length === 0)) {
      errors.push('Xác nhận mật khẩu là bắt buộc');
    }
    
    if (password !== confirmPassword) {
      errors.push('Mật khẩu xác nhận không khớp');
    }

    // Additional validation for important fields
    if (!phone || (typeof phone === 'string' && phone.trim().length === 0)) {
      errors.push('Số điện thoại là bắt buộc');
    }
    
    if (!dateOfBirth) {
      errors.push('Ngày sinh là bắt buộc');
    }
    
    if (!education || (typeof education === 'string' && education.trim().length === 0)) {
      errors.push('Học vấn là bắt buộc');
    }
    
    if (!teachingExperience || (typeof teachingExperience === 'string' && teachingExperience.trim().length === 0)) {
      errors.push('Kinh nghiệm giảng dạy là bắt buộc');
    }
    
    if (!preferredSubjects || !Array.isArray(preferredSubjects) || preferredSubjects.length === 0) {
      errors.push('Môn học ưa thích là bắt buộc');
    }
    
    if (!availability || (typeof availability === 'string' && availability.trim().length === 0)) {
      errors.push('Lịch trình giảng dạy là bắt buộc');
    }

    // If there are validation errors, return them all
    if (errors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        errors: errors,
        errorCount: errors.length
      });
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
    // Don't hash password here - User model will handle it in pre-save middleware
    const user = await User.create({
      username: email.split('@')[0], // Use email prefix as username
      email,
      password: password, // Let User model hash this
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

    // Send verification email with OTP
    try {
      const { sendVerificationEmail } = require('../services/emailService');
      await sendVerificationEmail(user.email, user.username, verificationOTP);
      console.log(`✅ Verification email sent to ${user.email} with OTP: ${verificationOTP}`);
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
      message: 'Đơn đăng ký đã được gửi thành công! Email xác thực với mã OTP 6 số đã được gửi đến email của bạn.', 
      data: { 
        application: app, 
        user: { 
          email: user.email, 
          fullName: user.fullName 
        },
        message: `Mã OTP 6 số đã được gửi đến ${user.email}. Vui lòng kiểm tra email và nhập mã để xác thực tài khoản.`
      }
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


