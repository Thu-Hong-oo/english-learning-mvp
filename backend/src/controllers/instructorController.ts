import { Response } from 'express'
import InstructorApplication from '../models/InstructorApplication'
import { AuthRequest } from '../middleware/auth'

// Submit instructor application
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


