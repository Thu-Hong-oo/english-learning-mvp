import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { apiService } from '@/services/api';
import { Calendar, Clock, User, Tag, Edit, Trash2, Eye, Heart, MessageCircle, Share2 } from 'lucide-react';
import CommentSection from './CommentSection';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  category: string;
  status: string;
  language: string;
  readingTime: number;
  views: number;
  likes: number;
  commentsCnt: number;
  authorId: {
    _id: string;
    username: string;
    fullName: string;
    avatar?: string;
  };
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const PostDetail: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPostBySlug(slug!);
      if (response.success) {
        setPost(response.data);
        // Check if user liked this post
        if (user) {
          // TODO: Implement like checking
        }
      } else {
        setError('Không tìm thấy bài viết');
      }
    } catch (err) {
      setError('Không thể tải bài viết');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // TODO: Implement like functionality
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Đã sao chép link vào clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Không tìm thấy bài viết'}
            </h1>
            <button
              onClick={() => navigate('/blog')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Quay lại blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/blog')}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
            >
              <span>← Quay lại blog</span>
            </button>
            
            {user && (user._id === post.authorId._id || user.role === 'admin') && (
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate(`/blog/edit/${post._id}`)}
                  className="px-3 py-1 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Sửa</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Bạn có chắc muốn xóa bài viết này?')) {
                      // TODO: Implement delete
                    }
                  }}
                  className="px-3 py-1 text-red-600 border border-red-300 rounded-md hover:bg-red-50 flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa</span>
                </button>
              </div>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta information */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{post.authorId.fullName || post.authorId.username}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{post.readingTime} phút đọc</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>{post.views} lượt xem</span>
            </div>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Cover Image */}
          {post.coverImage && (
            <div className="w-full h-64 md:h-80 overflow-hidden">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="p-6 md:p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          {/* Action Bar */}
          <div className="px-6 md:px-8 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                    isLiked 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{post.likes + (isLiked ? 1 : 0)}</span>
                </button>
                
                <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-md">
                  <MessageCircle className="w-4 h-4" />
                  <span>{post.commentsCnt} bình luận</span>
                </div>
              </div>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8">
          <CommentSection contentType="post" contentId={post._id} />
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
