import express from 'express'
import { authenticateToken, authorizeRole } from '../middleware/auth'
import { listPosts, getPostBySlug, createPost, updatePost, deletePost } from '../controllers/postController'

const router = express.Router()

// Public
router.get('/', listPosts)
router.get('/slug/:slug', getPostBySlug)
router.get('/:id', (req, res) => {
  // Handle ID-based post retrieval if needed
  res.status(404).json({ success: false, message: 'Use /slug/:slug for post retrieval' })
})

// Protected (author/admin)
router.post('/', authenticateToken, authorizeRole(['admin', 'teacher']), createPost)
router.put('/:id', authenticateToken, authorizeRole(['admin', 'teacher']), updatePost)
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deletePost)

export default router


