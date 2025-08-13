import express from 'express'
import { authenticateToken, authorizeRole } from '../middleware/auth'
import { listInstructorApplications, reviewInstructorApplication, setCourseStatus } from '../controllers/adminController'

const router = express.Router()

router.use(authenticateToken, authorizeRole(['admin']))

// Instructor applications
router.get('/instructor-applications', listInstructorApplications)
router.post('/instructor-applications/:id/review', reviewInstructorApplication)

// Course approvals
router.post('/courses/:id/status', setCourseStatus)

export default router


