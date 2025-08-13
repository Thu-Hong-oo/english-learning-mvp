import express from 'express'
import { authenticateToken, authorizeRole } from '../middleware/auth'
import { listPosts, getPostBySlug, createPost, updatePost, deletePost } from '../controllers/postController'

const router = express.Router()

// Public
router.get('/', listPosts)
router.get('/:slug', getPostBySlug)

// Protected (author/admin)
router.post('/', authenticateToken, authorizeRole(['admin', 'teacher']), createPost)
router.put('/:id', authenticateToken, authorizeRole(['admin', 'teacher']), updatePost)
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deletePost)

export default router


