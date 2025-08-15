import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { apiService } from '@/services/api';
import { Save, X, Eye, EyeOff, Tag, Image as ImageIcon } from 'lucide-react';

// Debug: Check if apiService is imported correctly
console.log('PostForm - apiService imported:', apiService);
console.log('PostForm - apiService.createPost:', apiService?.createPost);

interface PostFormProps {
  mode: 'create' | 'edit';
}

interface PostData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  category: string;
  status: 'draft' | 'published';
  language: 'en' | 'vi';
  readingTime: number;
}

const PostForm: React.FC<PostFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<PostData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    tags: [],
    category: '',
    status: 'draft',
    language: 'vi',
    readingTime: 3
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (mode === 'edit' && id) {
      fetchPost();
    }
  }, [mode, id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPostDetail(id!);
      if (response.success) {
        const post = response.data;
        setFormData({
          title: post.title || '',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || '',
          coverImage: post.coverImage || '',
          tags: post.tags || [],
          category: post.category || '',
          status: post.status || 'draft',
          language: post.language || 'vi',
          readingTime: post.readingTime || 3
        });
      }
    } catch (err) {
      setError('Không thể tải bài viết');
      console.error('Error fetching post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Tiêu đề và nội dung không được để trống');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('apiService:', apiService);
      console.log('apiService.createPost:', apiService.createPost);

      let response;
      if (mode === 'create') {
        response = await apiService.createPost(formData);
      } else {
        response = await apiService.updatePost(id!, formData);
      }

      if (response.success) {
        navigate('/blog');
      } else {
        setError(response.message || 'Có lỗi xảy ra');
      }
    } catch (err) {
      setError('Không thể lưu bài viết');
      console.error('Error saving post:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / wordsPerMinute);
    setFormData(prev => ({ ...prev, readingTime: time }));
  };

  if (loading && mode === 'edit') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {mode === 'create' ? 'Tạo bài viết mới' : 'Chỉnh sửa bài viết'}
              </h1>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/blog')}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Hủy</span>
                </button>
                <button
                  type="submit"
                  form="post-form"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Đang lưu...' : 'Lưu'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <form id="post-form" onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tiêu đề bài viết..."
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="bai-viet-tieng-anh"
              />
              <p className="mt-1 text-sm text-gray-500">
                Để trống để tự động tạo từ tiêu đề
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Tóm tắt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mô tả ngắn gọn về bài viết..."
              />
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={(e) => {
                  handleInputChange(e);
                  calculateReadingTime(e.target.value);
                }}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="Viết nội dung bài viết..."
                required
              />
              <div className="mt-2 flex justify-between text-sm text-gray-500">
                <span>Thời gian đọc: {formData.readingTime} phút</span>
                <span>{formData.content.length} ký tự</span>
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                Ảnh bìa
              </label>
              <div className="flex space-x-3">
                <input
                  type="url"
                  id="coverImage"
                  name="coverImage"
                  value={formData.coverImage}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Chọn ảnh</span>
                </button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Thêm tag..."
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Tag className="w-4 h-4" />
                  <span>Thêm</span>
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Category and Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Danh mục
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Chọn danh mục</option>
                  <option value="tieng-anh">Tiếng Anh</option>
                  <option value="hoc-tap">Học tập</option>
                  <option value="kinh-nghiem">Kinh nghiệm</option>
                  <option value="tips">Tips & Tricks</option>
                  <option value="khac">Khác</option>
                </select>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  Ngôn ngữ
                </label>
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Xuất bản</option>
              </select>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
