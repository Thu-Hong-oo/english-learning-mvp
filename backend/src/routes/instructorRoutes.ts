import express from 'express'
import { authenticateToken, authorizeRole } from '../middleware/auth'
import { submitApplication, myApplication } from '../controllers/instructorController'

const router = express.Router()

router.use(authenticateToken)

router.post('/applications', authorizeRole(['student', 'teacher', 'admin']), submitApplication)
router.get('/applications/me', myApplication)

export default router


