import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { apiService } from '../services/api'
import { 
  Users, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
  Info
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
  category: string
  status: 'draft' | 'published' | 'archived'
  adminApproval: 'pending' | 'approved' | 'rejected'
  adminApprovedBy?: string
  adminApprovedAt?: string
  adminRejectionReason?: string
  teacher: {
    username: string
    fullName: string
  }
  totalStudents: number
  rating: number
  createdAt: string
}

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
}

function Modal({ isOpen, onClose, title, message, type, onConfirm, confirmText = 'OK', cancelText = 'Cancel' }: ModalProps) {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />
    }
  }

  const getButtonColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-600 hover:bg-green-700'
      case 'error':
        return 'bg-red-600 hover:bg-red-700'
      case 'warning':
        return 'bg-yellow-600 hover:bg-yellow-700'
      case 'info':
        return 'bg-blue-600 hover:bg-blue-700'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center space-x-3 mb-4">
          {getIcon()}
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          {onConfirm && (
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
          )}
          <Button 
            onClick={onConfirm || onClose}
            className={onConfirm ? getButtonColor() : 'bg-gray-600 hover:bg-gray-700'}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<InstructorApplication[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [modal, setModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    onConfirm?: () => void
    confirmText?: string
    cancelText?: string
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  })

  const showModal = (title: string, message: string, type: 'success' | 'error' | 'warning' | 'info', onConfirm?: () => void, confirmText?: string, cancelText?: string) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
      onConfirm,
      confirmText,
      cancelText
    })
  }

  const showSuccessModal = (title: string, message: string, onConfirm?: () => void) => {
    showModal(title, message, 'success', onConfirm, 'OK');
  }

  const closeModal = () => {
    setModal(prev => ({ ...prev, isOpen: false }))
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const [appsRes, coursesRes] = await Promise.all([
        apiService.getAdminInstructorApplications(),
        apiService.getAdminAllCourses()
      ])
      
      const appsData = appsRes
      const coursesData = coursesRes
      
      if (appsData.success) {
        setApplications(appsData.data?.items || appsData.data || [])
      } else {
        console.error('Failed to fetch applications:', appsData.message)
      }
      
      if (coursesData.success) {
        console.log('Courses data:', coursesData.data)
        setCourses(Array.isArray(coursesData.data) ? coursesData.data : [])
      } else {
        console.error('Failed to fetch courses:', coursesData.message)
        setCourses([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('Có lỗi xảy ra khi tải dữ liệu')
    } finally {
      setLoading(false)
    }
  }

  const handleReviewApplication = async (id: string, action: 'approve' | 'reject', notes?: string) => {
    try {
      const response = await apiService.reviewInstructorApplication(id, { action, notes })
      
      if (response.success) {
        showSuccessModal(
          'Thành công',
          response.message,
          () => {
            fetchData();
            closeModal();
            if (action === 'approve') {
              setTimeout(() => {
                showModal(
                  'Lưu ý',
                  'User đã được cập nhật role thành teacher. Họ cần đăng xuất và đăng nhập lại để nhận quyền mới.',
                  'info'
                );
              }, 300);
            }
          }
        );
      } else {
        showModal('Lỗi', response.message || 'Có lỗi xảy ra khi duyệt đơn đăng ký', 'error');
      }
    } catch (error) {
      console.error('Error reviewing application:', error)
      showModal('Lỗi', 'Có lỗi xảy ra khi duyệt đơn đăng ký', 'error');
    }
  }

  const handleCourseApproval = async (id: string, action: 'approve' | 'reject', reason?: string) => {
    try {
      let rejectionReason = reason;
      
      if (action === 'reject' && !reason) {
        rejectionReason = prompt('Nhập lý do từ chối khóa học:') || 'Không có lý do';
      }
      
      const response = await apiService.updateCourseAdminApproval(id, { action, reason: rejectionReason })
      
      if (response.success) {
        showSuccessModal(
          'Thành công',
          `Khóa học đã được ${action === 'approve' ? 'duyệt' : 'từ chối'} thành công!`,
          () => {
            fetchData();
            closeModal();
          }
        );
      } else {
        showModal('Lỗi', response.message || 'Có lỗi xảy ra khi duyệt khóa học', 'error');
      }
    } catch (error) {
      console.error('Error approving course:', error)
      showModal('Lỗi', 'Có lỗi xảy ra khi duyệt khóa học', 'error');
    }
  }

  const handleCourseStatus = async (id: string, status: 'draft' | 'published' | 'archived') => {
    try {
      const response = await apiService.updateCourseAdminStatus(id, { status })
      
      if (response.success) {
        const statusText = status === 'published' ? 'xuất bản' : status === 'archived' ? 'lưu trữ' : 'bản nháp';
        showSuccessModal(
          'Thành công',
          `Khóa học đã được cập nhật trạng thái thành ${statusText}!`,
          () => {
            fetchData();
            closeModal();
          }
        );
      } else {
        showModal('Lỗi', response.message || 'Có lỗi xảy ra khi cập nhật trạng thái khóa học', 'error');
      }
    } catch (error) {
      console.error('Error updating course status:', error)
      showModal('Lỗi', 'Có lỗi xảy ra khi cập nhật trạng thái khóa học', 'error');
    }
  }

  const pendingApplications = (applications || []).filter(app => app.status === 'pending')
  const pendingCourses = (courses || []).filter(course => course.adminApproval === 'pending')
  const approvedCourses = (courses || []).filter(course => course.adminApproval === 'approved')
  const rejectedCourses = (courses || []).filter(course => course.adminApproval === 'rejected')

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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchData} className="bg-orange-500 hover:bg-orange-600">
            Thử lại
          </Button>
        </div>
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
                  <CardTitle className="text-sm font-medium">Khóa học chờ duyệt</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{pendingCourses.length}</div>
                  <p className="text-xs text-muted-foreground">Chờ admin duyệt</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Khóa học đã duyệt</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{approvedCourses.length}</div>
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
                    {applications.length > 0 ? (
                      applications.slice(0, 5).map((app) => (
                        <div key={app._id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{app.fullName}</p>
                            <p className="text-sm text-gray-500">{app.userId?.email || 'N/A'}</p>
                          </div>
                          {getStatusBadge(app.status)}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">Chưa có đơn đăng ký nào</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Khóa học gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.length > 0 ? (
                      courses.slice(0, 5).map((course) => (
                        <div key={course._id} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{course.title}</p>
                            <p className="text-sm text-gray-500">bởi {course.teacher?.fullName || 'N/A'}</p>
                          </div>
                          {getStatusBadge(course.status)}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-4">Chưa có khóa học nào</p>
                    )}
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
                          <p className="text-sm text-gray-500">{app.userId?.email || 'N/A'}</p>
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
                          <h3 className="font-semibold cursor-pointer hover:text-blue-600" 
                              onClick={() => window.open(`/course/${course._id}`, '_blank')}>
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-500">Giảng viên: {course.teacher?.fullName || 'N/A'}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(course.status)}
                          {getStatusBadge(course.adminApproval)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{course.description}</p>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        <span>Học viên: {course.totalStudents}</span>
                        <span>Đánh giá: {course.rating.toFixed(1)}/5</span>
                        <span>Danh mục: {course.category}</span>
                        <span>Ngày tạo: {new Date(course.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`/course/${course._id}`, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem chi tiết
                        </Button>
                        {course.adminApproval === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleCourseApproval(course._id, 'approve')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCourseApproval(course._id, 'reject')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Từ chối
                            </Button>
                          </>
                        )}
                        {course.adminApproval === 'approved' && course.status === 'draft' && (
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
                      <span>Chờ duyệt</span>
                      <span className="font-semibold text-yellow-600">{pendingCourses.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Đã duyệt</span>
                      <span className="font-semibold text-green-600">{approvedCourses.length}</span>
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

      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        title={modal.title}
        message={modal.message}
        type={modal.type}
        onConfirm={modal.onConfirm}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
      />
    </div>
  )
}
