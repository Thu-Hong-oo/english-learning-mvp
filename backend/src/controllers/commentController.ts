import { Request, Response } from 'express'
import Comment from '../models/Comment'
import Post from '../models/Post'
import { AuthRequest } from '../middleware/auth'

// Get comments for a specific content
export const getComments = async (req: Request, res: Response) => {
  try {
    const { contentType, contentId, page = 1, limit = 20 } = req.query as any
    const filter: any = { 
      contentType, 
      contentId, 
      isDeleted: false,
      isApproved: true 
    }

    const skip = (Number(page) - 1) * Number(limit)
    
    const [comments, total] = await Promise.all([
      Comment.find(filter)
        .populate('user', 'username fullName avatar')
        .populate('replies')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('-__v'),
      Comment.countDocuments(filter)
    ])

    res.json({ 
      success: true, 
      data: { 
        items: comments, 
        pagination: { 
          page: Number(page), 
          limit: Number(limit), 
          total, 
          pages: Math.ceil(total / Number(limit)) 
        } 
      } 
    })
  } catch (err) {
    console.error('Error getting comments:', err)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Create a new comment
export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const { content, contentType, contentId, parentId, language } = req.body

    // Validate content exists
    if (contentType === 'post') {
      const post = await Post.findById(contentId)
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' })
      }
    }

    const comment = await Comment.create({
      user: req.user.userId,
      content,
      contentType,
      contentId,
      parentId,
      language: language || 'vi'
    })

    // Populate user info
    await comment.populate('user', 'username fullName avatar')

    // Update comment count if it's a post
    if (contentType === 'post') {
      await Post.findByIdAndUpdate(contentId, { $inc: { commentsCnt: 1 } })
    }

    res.status(201).json({ 
      success: true, 
      message: 'Comment created successfully', 
      data: comment 
    })
  } catch (err) {
    console.error('Error creating comment:', err)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Update a comment
export const updateComment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const { id } = req.params
    const { content } = req.body

    const comment = await Comment.findById(id)
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' })
    }

    // Check if user owns the comment
    if (comment.user.toString() !== req.user.userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this comment' })
    }

    comment.content = content
    comment.isEdited = true
    comment.editedAt = new Date()
    await comment.save()

    res.json({ 
      success: true, 
      message: 'Comment updated successfully', 
      data: comment 
    })
  } catch (err) {
    console.error('Error updating comment:', err)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Delete a comment (soft delete)
export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const { id } = req.params
    const comment = await Comment.findById(id)
    
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' })
    }

    // Check if user owns the comment or is admin
    if (comment.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this comment' })
    }

    // Soft delete
    comment.isDeleted = true
    comment.deletedAt = new Date()
    await comment.save()

    // Update comment count if it's a post
    if (comment.contentType === 'post') {
      await Post.findByIdAndUpdate(comment.contentId, { $inc: { commentsCnt: -1 } })
    }

    res.json({ 
      success: true, 
      message: 'Comment deleted successfully' 
    })
  } catch (err) {
    console.error('Error deleting comment:', err)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Like/Unlike a comment
export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const { id } = req.params
    const comment = await Comment.findById(id)
    
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' })
    }

    const userId = req.user.userId
    const isLiked = comment.likes.includes(userId)
    const isDisliked = comment.dislikes.includes(userId)

    if (isLiked) {
      // Unlike
      comment.likes = comment.likes.filter(id => id.toString() !== userId)
    } else {
      // Like
      comment.likes.push(userId)
      // Remove dislike if exists
      if (isDisliked) {
        comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId)
      }
    }

    await comment.save()
    res.json({ 
      success: true, 
      message: isLiked ? 'Comment unliked' : 'Comment liked',
      data: { likes: comment.likes.length, dislikes: comment.dislikes.length }
    })
  } catch (err) {
    console.error('Error toggling like:', err)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Dislike/Undislike a comment
export const toggleDislike = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const { id } = req.params
    const comment = await Comment.findById(id)
    
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' })
    }

    const userId = req.user.userId
    const isDisliked = comment.dislikes.includes(userId)
    const isLiked = comment.likes.includes(userId)

    if (isDisliked) {
      // Undislike
      comment.dislikes = comment.dislikes.filter(id => id.toString() !== userId)
    } else {
      // Dislike
      comment.dislikes.push(userId)
      // Remove like if exists
      if (isLiked) {
        comment.likes = comment.likes.filter(id => id.toString() !== userId)
      }
    }

    await comment.save()
    res.json({ 
      success: true, 
      message: isDisliked ? 'Comment undisliked' : 'Comment disliked',
      data: { likes: comment.likes.length, dislikes: comment.dislikes.length }
    })
  } catch (err) {
    console.error('Error toggling dislike:', err)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}

// Report a comment
export const reportComment = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const { id } = req.params
    const { reason } = req.body

    const comment = await Comment.findById(id)
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' })
    }

    comment.isReported = true
    comment.reportReason = reason
    await comment.save()

    res.json({ 
      success: true, 
      message: 'Comment reported successfully' 
    })
  } catch (err) {
    console.error('Error reporting comment:', err)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
