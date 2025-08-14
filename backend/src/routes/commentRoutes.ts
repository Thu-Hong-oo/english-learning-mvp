import express from 'express'
import { authenticateToken } from '../middleware/auth'
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  toggleLike,
  toggleDislike,
  reportComment
} from '../controllers/commentController'

const router = express.Router()

// Public routes
router.get('/', getComments)

// Protected routes
router.use(authenticateToken)
router.post('/', createComment)
router.put('/:id', updateComment)
router.delete('/:id', deleteComment)
router.post('/:id/like', toggleLike)
router.post('/:id/dislike', toggleDislike)
router.post('/:id/report', reportComment)

export default router
