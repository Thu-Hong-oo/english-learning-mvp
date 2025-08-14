import { Request, Response } from 'express'
import Post from '../models/Post'
import { AuthRequest } from '../middleware/auth'

export const listPosts = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, tag, category, status = 'published' } = req.query as any
    const filter: any = {}
    if (status) filter.status = status
    if (tag) filter.tags = tag
    if (category) filter.category = category
    if (search) filter.$or = [{ title: { $regex: search, $options: 'i' } }, { excerpt: { $regex: search, $options: 'i' } }]

    const skip = (Number(page) - 1) * Number(limit)
    const [items, total] = await Promise.all([
      Post.find(filter).sort({ publishedAt: -1, createdAt: -1 }).skip(skip).limit(Number(limit)).select('-__v'),
      Post.countDocuments(filter),
    ])
    res.json({ success: true, data: { items, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } } })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const getPostBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const post = await Post.findOne({ slug, status: 'published' }).populate('authorId', 'username fullName avatar')
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' })
    
    // Increment view count
    await Post.findByIdAndUpdate(post._id, { $inc: { views: 1 } })
    
    res.json({ success: true, data: post })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' })
    const { title, slug, excerpt, content, coverImage, tags, category, status, language, readingTime, publishedAt } = req.body
    const post = await Post.create({ authorId: req.user.userId, title, slug, excerpt, content, coverImage, tags, category, status, language, readingTime, publishedAt })
    res.status(201).json({ success: true, message: 'Post created', data: post })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const updated = await Post.findByIdAndUpdate(id, req.body, { new: true })
    if (!updated) return res.status(404).json({ success: false, message: 'Post not found' })
    res.json({ success: true, message: 'Post updated', data: updated })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const deleted = await Post.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ success: false, message: 'Post not found' })
    res.json({ success: true, message: 'Post deleted' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}


