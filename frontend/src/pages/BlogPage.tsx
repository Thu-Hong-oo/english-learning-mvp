"use client"

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { apiService } from '@/services/api'
import { Search, Clock, Eye, Heart, MessageCircle, Plus, Filter } from 'lucide-react'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  coverImage?: string
  tags: string[]
  category?: string
  readingTime: number
  views: number
  likes: number
  commentsCnt: number
  publishedAt: string
  authorId: {
    fullName: string
    username: string
  }
}

export default function BlogPage() {
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const categories = [
    'Tất cả',
    'tieng-anh',
    'hoc-tap',
    'kinh-nghiem',
    'tips',
    'khac'
  ]

  const categoryLabels = {
    'tieng-anh': 'Tiếng Anh',
    'hoc-tap': 'Học tập',
    'kinh-nghiem': 'Kinh nghiệm',
    'tips': 'Tips & Tricks',
    'khac': 'Khác'
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await apiService.getPosts({ status: 'published' })
      if (response.success) {
        setPosts(response.data.items)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || selectedCategory === 'Tất cả' || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Bài viết</h1>
              <p className="text-gray-600 text-lg">Khám phá các bài viết hữu ích về học tiếng Anh</p>
            </div>
            
            {user && (user.role === 'teacher' || user.role === 'admin') && (
              <Button
                onClick={() => navigate('/blog/create')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Tạo bài viết</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="px-4 py-3 flex items-center space-x-2"
            >
              <Filter className="w-5 h-5" />
              <span>Lọc</span>
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Danh mục</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category === 'Tất cả' ? '' : category)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      (category === 'Tất cả' && !selectedCategory) || 
                      (category !== 'Tất cả' && selectedCategory === category)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'Tất cả' ? 'Tất cả' : categoryLabels[category as keyof typeof categoryLabels]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bài viết</h3>
            <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post._id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div 
                  className="h-48 bg-gray-200 rounded-t-lg overflow-hidden"
                  onClick={() => navigate(`/blog/${post.slug}`)}
                >
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white text-lg font-medium">No Image</span>
                    </div>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <div className="mb-3">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {categoryLabels[post.category as keyof typeof categoryLabels] || 'Khác'}
                    </span>
                  </div>
                  
                  <h3 
                    className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 cursor-pointer"
                    onClick={() => navigate(`/blog/${post.slug}`)}
                  >
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{post.authorId.fullName || post.authorId.username}</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{post.readingTime} phút</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{post.views}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.commentsCnt}</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => navigate(`/blog/${post.slug}`)}
                      variant="outline"
                      size="sm"
                    >
                      Đọc tiếp
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
