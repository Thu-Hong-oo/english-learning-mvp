import React, { useState, useEffect } from 'react';
import { useAppSelector } from '../store/hooks';
import { apiService } from '../services/api';
import { ThumbsUp, ThumbsDown, MessageCircle, Edit, Trash2, Flag, User, Clock } from 'lucide-react';

interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  content: string;
  contentType: string;
  contentId: string;
  parentId?: string;
  replies: Comment[];
  likes: string[];
  dislikes: string[];
  isEdited: boolean;
  editedAt?: Date;
  createdAt: string;
  updatedAt: string;
}

interface CommentSectionProps {
  contentType: string;
  contentId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ contentType, contentId }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchComments();
  }, [contentType, contentId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await apiService.getComments(contentType, contentId);
      if (response.success) {
        setComments(response.data.items || []);
      }
    } catch (err) {
      setError('Không thể tải bình luận');
      console.error('Error fetching comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      setLoading(true);
      const response = await apiService.createComment(contentType, contentId, {
        content: newComment,
        language: 'vi'
      });

      if (response.success) {
        setNewComment('');
        fetchComments();
      }
    } catch (err) {
      setError('Không thể đăng bình luận');
      console.error('Error creating comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (commentId: string) => {
    if (!replyContent.trim() || !user) return;

    try {
      setLoading(true);
      const response = await apiService.createComment(contentType, contentId, {
        content: replyContent,
        parentId: commentId,
        language: 'vi'
      });

      if (response.success) {
        setReplyContent('');
        setReplyTo(null);
        fetchComments();
      }
    } catch (err) {
      setError('Không thể đăng phản hồi');
      console.error('Error creating reply:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      setLoading(true);
      const response = await apiService.updateComment(commentId, { content: editContent });

      if (response.success) {
        setEditingComment(null);
        setEditContent('');
        fetchComments();
      }
    } catch (err) {
      setError('Không thể cập nhật bình luận');
      console.error('Error updating comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm('Bạn có chắc muốn xóa bình luận này?')) return;

    try {
      setLoading(true);
      const response = await apiService.deleteComment(commentId);

      if (response.success) {
        fetchComments();
      }
    } catch (err) {
      setError('Không thể xóa bình luận');
      console.error('Error deleting comment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!user) return;

    try {
      const response = await apiService.likeComment(commentId);

      if (response.success) {
        fetchComments();
      }
    } catch (err) {
      console.error('Error liking comment:', err);
    }
  };

  const handleDislike = async (commentId: string) => {
    if (!user) return;

    try {
      const response = await apiService.dislikeComment(commentId);

      if (response.success) {
        fetchComments();
      }
    } catch (err) {
      console.error('Error disliking comment:', err);
    }
  };

  const handleReport = async (commentId: string) => {
    const reason = prompt('Lý do báo cáo:');
    if (!reason) return;

    try {
      const response = await apiService.reportComment(commentId, { reason });

      if (response.success) {
        alert('Báo cáo đã được gửi');
      }
    } catch (err) {
      console.error('Error reporting comment:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isOwner = user?._id === comment.user._id;
    const isLiked = comment.likes.includes(user?._id || '');
    const isDisliked = comment.dislikes.includes(user?._id || '');

    return (
      <div key={comment._id} className={`border-l-2 border-gray-200 pl-4 mb-4 ${isReply ? 'ml-8' : ''}`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {comment.user.avatar ? (
              <img
                src={comment.user.avatar}
                alt={comment.user.fullName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-medium text-gray-900">
                {comment.user.fullName || comment.user.username}
              </span>
              <span className="text-sm text-gray-500">
                <Clock className="w-3 h-3 inline mr-1" />
                {formatDate(comment.createdAt)}
              </span>
              {comment.isEdited && (
                <span className="text-xs text-gray-400">(đã chỉnh sửa)</span>
              )}
            </div>
            
            {editingComment === comment._id ? (
              <div className="mb-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md resize-none"
                  rows={3}
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleEdit(comment._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                    disabled={loading}
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 mb-2">{comment.content}</p>
            )}
            
            <div className="flex items-center space-x-4 text-sm">
              <button
                onClick={() => handleLike(comment._id)}
                className={`flex items-center space-x-1 ${
                  isLiked ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'
                }`}
                disabled={!user}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{comment.likes.length}</span>
              </button>
              
              <button
                onClick={() => handleDislike(comment._id)}
                className={`flex items-center space-x-1 ${
                  isDisliked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
                disabled={!user}
              >
                <ThumbsDown className="w-4 h-4" />
                <span>{comment.dislikes.length}</span>
              </button>
              
              <button
                onClick={() => setReplyTo(comment._id)}
                className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
                disabled={!user}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Phản hồi</span>
              </button>
              
              {isOwner && (
                <>
                  <button
                    onClick={() => {
                      setEditingComment(comment._id);
                      setEditContent(comment.content);
                    }}
                    className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Sửa</span>
                  </button>
                  
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="flex items-center space-x-1 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Xóa</span>
                  </button>
                </>
              )}
              
              {!isOwner && (
                <button
                  onClick={() => handleReport(comment._id)}
                  className="flex items-center space-x-1 text-gray-500 hover:text-red-500"
                  disabled={!user}
                >
                  <Flag className="w-4 h-4" />
                  <span>Báo cáo</span>
                </button>
              )}
            </div>
            
            {/* Reply form */}
            {replyTo === comment._id && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Viết phản hồi..."
                  className="w-full p-2 border border-gray-300 rounded-md resize-none"
                  rows={2}
                />
                <div className="flex space-x-2 mt-2">
                  <button
                    onClick={() => handleReply(comment._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
                    disabled={loading || !replyContent.trim()}
                  >
                    Gửi
                  </button>
                  <button
                    onClick={() => {
                      setReplyTo(null);
                      setReplyContent('');
                    }}
                    className="px-3 py-1 bg-gray-500 text-white rounded-md text-sm hover:bg-gray-600"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}
            
            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-3">
                {comment.replies.map((reply) => renderComment(reply, true))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading && comments.length === 0) {
    return (
      <div className="mt-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Bình luận ({comments.length})
      </h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Comment form */}
      {user && (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName || user.username}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                required
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={loading || !newComment.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang gửi...' : 'Gửi bình luận'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
      
      {/* Comments list */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
          </div>
        ) : (
          comments.map((comment, index) => renderComment(comment, false))
        )}
      </div>
    </div>
  );
};

export default CommentSection;
