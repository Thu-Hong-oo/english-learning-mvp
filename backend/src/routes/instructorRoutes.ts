import express from 'express'
import { authenticateToken, authorizeRole } from '../middleware/auth'
import { submitApplication, submitPublicApplication, myApplication } from '../controllers/instructorController'

const router = express.Router()

// Public route - no authentication required
router.post('/applications/public', submitPublicApplication)

// Protected routes - require authentication
router.use(authenticateToken)
router.post('/applications', authorizeRole(['student', 'teacher', 'admin']), submitApplication)
router.get('/applications/me', myApplication)

export default router


