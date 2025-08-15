import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAppSelector } from '@/store/hooks'
import { apiService } from '@/services/api'
import { 
  User, 
  BookOpen, 
  Plus, 
  Edit, 
  Settings, 
  BarChart3, 
  Users, 
  FileText,
  Calendar,
  Award,
  TrendingUp,
  Eye,
  Clock,
  Star
} from 'lucide-react'

interface Course {
  _id: string
  title: string
  description: string
  price: number
  category: string
  level: string
  status: 'draft' | 'published' | 'archived'
  adminApproval: 'pending' | 'approved' | 'rejected'
  adminApprovedBy?: string
  adminApprovedAt?: string
  adminRejectionReason?: string
  enrolledStudents: number
  rating: number
  createdAt: string
  updatedAt: string
}

interface Lesson {
  _id: string
  title: string
  description: string
  duration: number
  type: 'video' | 'text' | 'quiz'
  status: 'draft' | 'published'
  createdAt: string
}

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [courses, setCourses] = useState<Course[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0
  })

  const { user } = useAppSelector(state => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'teacher') {
      navigate('/login')
      return
    }
    
    fetchDashboardData()
  }, [user, navigate])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      // Fetch courses
      const coursesResponse = await apiService.getCourses();
      
      if (coursesResponse.success) {
        setCourses(coursesResponse.data || []);
      }

      // Fetch lessons
      const lessonsResponse = await apiService.getLessonsByTeacher();
      
      if (lessonsResponse.success) {
        setLessons(lessonsResponse.data || []);
      }

      // Calculate stats
      const totalStudents = courses.reduce((sum, course) => sum + course.enrolledStudents, 0)
      const totalRevenue = courses.reduce((sum, course) => sum + (course.price * course.enrolledStudents), 0)
      const averageRating = courses.length > 0 
        ? courses.reduce((sum, course) => sum + course.rating, 0) / courses.length 
        : 0

      setStats({
        totalCourses: courses.length,
        totalStudents,
        totalRevenue,
        averageRating: Math.round(averageRating * 10) / 10
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCourse = () => {
    navigate('/teacher/courses/create')
  }

  const handleCreateLesson = () => {
    navigate('/teacher/lessons/create')
  }

  const handleEditProfile = () => {
    navigate('/teacher/profile')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
                <p className="text-gray-600">Chào mừng trở lại, {user?.fullName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={handleEditProfile}>
                <Settings className="w-4 h-4 mr-2" />
                Cài đặt
              </Button>
              <Button onClick={() => navigate('/')}>
                Về trang chủ
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Tổng khóa học</p>
                  <p className="text-3xl font-bold">{stats.totalCourses}</p>
                </div>
                <BookOpen className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Học viên</p>
                  <p className="text-3xl font-bold">{stats.totalStudents}</p>
                </div>
                <Users className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Doanh thu</p>
                  <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Đánh giá TB</p>
                  <p className="text-3xl font-bold">{stats.averageRating}/5</p>
                </div>
                <Star className="w-8 h-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Tổng quan</span>
            </TabsTrigger>
            <TabsTrigger value="courses" className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4" />
              <span>Khóa học</span>
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Bài học</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Thống kê</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Khóa học gần đây</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {courses.slice(0, 5).map((course) => (
                    <div key={course._id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-gray-600">{course.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex flex-col items-end space-y-1">
                          <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                            {course.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                          </Badge>
                          {course.adminApproval === 'pending' && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              Chờ duyệt
                            </Badge>
                          )}
                          {course.adminApproval === 'rejected' && (
                            <Badge variant="destructive">
                              Bị từ chối
                            </Badge>
                          )}
                          {course.adminApproval === 'approved' && course.status === 'draft' && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              Đã duyệt
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{course.enrolledStudents} học viên</p>
                      </div>
                    </div>
                  ))}
                  {courses.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Chưa có khóa học nào</p>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="w-5 h-5" />
                    <span>Thao tác nhanh</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button onClick={handleCreateCourse} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo khóa học mới
                  </Button>
                  <Button onClick={handleCreateLesson} variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Tạo bài học mới
                  </Button>
                  <Button onClick={handleEditProfile} variant="outline" className="w-full">
                    <Edit className="w-4 h-4 mr-2" />
                    Chỉnh sửa hồ sơ
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Quản lý khóa học</h2>
              <Button onClick={handleCreateCourse}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo khóa học
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                        {course.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                      </Badge>
                    </div>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Danh mục:</span>
                        <span>{course.category}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Cấp độ:</span>
                        <span>{course.level}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Học viên:</span>
                        <span>{course.enrolledStudents}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Đánh giá:</span>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="ml-1">{course.rating}/5</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Giá:</span>
                        <span className="font-semibold">${course.price}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/teacher/courses/${course._id}/edit`)}>
                        <Edit className="w-4 h-4 mr-1" />
                        Chỉnh sửa
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => navigate(`/teacher/courses/${course._id}/preview`)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Xem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {courses.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có khóa học nào</h3>
                  <p className="text-gray-600 mb-4">Bắt đầu tạo khóa học đầu tiên của bạn</p>
                  <Button onClick={handleCreateCourse}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo khóa học
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Lessons Tab */}
          <TabsContent value="lessons" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Quản lý bài học</h2>
              <Button onClick={handleCreateLesson}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo bài học
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <Card key={lesson._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      <Badge variant={lesson.status === 'published' ? 'default' : 'secondary'}>
                        {lesson.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                      </Badge>
                    </div>
                    <CardDescription>{lesson.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Loại:</span>
                        <span className="capitalize">{lesson.type}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Thời lượng:</span>
                        <span>{lesson.duration} phút</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Ngày tạo:</span>
                        <span>{new Date(lesson.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Chỉnh sửa
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        Xem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {lessons.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có bài học nào</h3>
                  <p className="text-gray-600 mb-4">Bắt đầu tạo bài học đầu tiên của bạn</p>
                  <Button onClick={handleCreateLesson}>
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo bài học
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Thống kê chi tiết</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê khóa học</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Tổng khóa học:</span>
                      <span className="font-semibold">{stats.totalCourses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đã xuất bản:</span>
                      <span className="font-semibold">{courses.filter(c => c.status === 'published').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bản nháp:</span>
                      <span className="font-semibold">{courses.filter(c => c.status === 'draft').length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thống kê học viên</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Tổng học viên:</span>
                      <span className="font-semibold">{stats.totalStudents}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đánh giá trung bình:</span>
                      <span className="font-semibold">{stats.averageRating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Doanh thu:</span>
                      <span className="font-semibold">${stats.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
