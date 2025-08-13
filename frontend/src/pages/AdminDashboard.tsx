import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  MessageSquare,
  TrendingUp
} from 'lucide-react'

interface InstructorApplication {
  _id: string
  userId: {
    username: string
    email: string
    fullName: string
  }
  fullName: string
  bio?: string
  expertise?: string[]
  experienceYears?: number
  portfolioUrl?: string
  status: 'pending' | 'approved' | 'rejected'
  reviewNotes?: string
  createdAt: string
  reviewedAt?: string
}

interface Course {
  _id: string
  title: string
  description: string
  status: 'draft' | 'published' | 'archived'
  teacher: {
    username: string
    fullName: string
  }
  totalStudents: number
  rating: number
  createdAt: string
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<InstructorApplication[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [appsRes, coursesRes] = await Promise.all([
        fetch('http://localhost:3000/api/admin/instructor-applications'),
        fetch('http://localhost:3000/api/courses')
      ])
      
      const appsData = await appsRes.json()
      const coursesData = await coursesRes.json()
      
      if (appsData.success) setApplications(appsData.data.items)
      if (coursesData.success) setCourses(coursesData.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewApplication = async (id: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/instructor-applications/${id}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, notes })
      })
      
      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error('Error reviewing application:', error)
    }
  }

  const handleCourseStatus = async (id: string, status: 'draft' | 'published' | 'archived') => {
    try {
      const response = await fetch(`http://localhost:3000/api/admin/courses/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      
      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error('Error updating course status:', error)
    }
  }

  const pendingApplications = applications.filter(app => app.status === 'pending')
  const publishedCourses = courses.filter(course => course.status === 'published')
  const draftCourses = courses.filter(course => course.status === 'draft')

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-blue-100 text-blue-800',
      archived: 'bg-red-100 text-red-800'
    }
    return <Badge className={variants[status as keyof typeof variants]}>{status}</Badge>
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bảng điều khiển Admin</h1>
          <p className="text-gray-600">Quản lý đơn đăng ký giảng viên và duyệt khóa học</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="applications">Đơn đăng ký</TabsTrigger>
            <TabsTrigger value="courses">Khóa học</TabsTrigger>
            <TabsTrigger value="analytics">Thống kê</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Đơn chờ duyệt</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingApplications.length}</div>
                  <p className="text-xs text-muted-foreground">Đơn đăng ký giảng viên</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Khóa học đã xuất bản</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{publishedCourses.length}</div>
                  <p className="text-xs text-muted-foreground">Khóa học đang hoạt động</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Khóa học nháp</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{draftCourses.length}</div>
                  <p className="text-xs text-muted-foreground">Chờ duyệt xuất bản</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng giảng viên</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{applications.filter(app => app.status === 'approved').length}</div>
                  <p className="text-xs text-muted-foreground">Giảng viên đã được duyệt</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Đơn đăng ký gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.slice(0, 5).map((app) => (
                      <div key={app._id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{app.fullName}</p>
                          <p className="text-sm text-gray-500">{app.userId.email}</p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Khóa học gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.slice(0, 5).map((course) => (
                      <div key={course._id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{course.title}</p>
                          <p className="text-sm text-gray-500">bởi {course.teacher.fullName}</p>
                        </div>
                        {getStatusBadge(course.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Đơn đăng ký giảng viên</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{app.fullName}</h3>
                          <p className="text-sm text-gray-500">{app.userId.email}</p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                      
                      {app.bio && <p className="text-sm text-gray-600 mb-2">{app.bio}</p>}
                      
                      {app.expertise && app.expertise.length > 0 && (
                        <div className="flex gap-2 mb-3">
                          {app.expertise.map((exp) => (
                            <Badge key={exp} variant="outline">{exp}</Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>Kinh nghiệm: {app.experienceYears || 0} năm</span>
                        <span>Ngày nộp: {new Date(app.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      
                      {app.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleReviewApplication(app._id, 'approve')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Duyệt
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReviewApplication(app._id, 'reject')}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Từ chối
                          </Button>
                        </div>
                      )}
                      
                      {app.reviewNotes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <p className="text-sm font-medium">Ghi chú:</p>
                          <p className="text-sm text-gray-600">{app.reviewNotes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quản lý khóa học</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.map((course) => (
                    <div key={course._id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-sm text-gray-500">Giảng viên: {course.teacher.fullName}</p>
                        </div>
                        {getStatusBadge(course.status)}
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>Học viên: {course.totalStudents}</span>
                        <span>Đánh giá: {course.rating.toFixed(1)}/5</span>
                        <span>Ngày tạo: {new Date(course.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {course.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={() => handleCourseStatus(course._id, 'published')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Xuất bản
                          </Button>
                        )}
                        {course.status === 'published' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCourseStatus(course._id, 'archived')}
                          >
                            Lưu trữ
                          </Button>
                        )}
                        {course.status === 'archived' && (
                          <Button
                            size="sm"
                            onClick={() => handleCourseStatus(course._id, 'published')}
                          >
                            Khôi phục
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê đơn đăng ký</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Chờ duyệt</span>
                      <span className="font-semibold">{pendingApplications.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đã duyệt</span>
                      <span className="font-semibold text-green-600">
                        {applications.filter(app => app.status === 'approved').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đã từ chối</span>
                      <span className="font-semibold text-red-600">
                        {applications.filter(app => app.status === 'rejected').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thống kê khóa học</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Đã xuất bản</span>
                      <span className="font-semibold text-green-600">{publishedCourses.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nháp</span>
                      <span className="font-semibold text-yellow-600">{draftCourses.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đã lưu trữ</span>
                      <span className="font-semibold text-red-600">
                        {courses.filter(course => course.status === 'archived').length}
                      </span>
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
