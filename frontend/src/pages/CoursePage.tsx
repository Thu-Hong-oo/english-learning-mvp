
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Star, Users, BookOpen, Clock, Award } from "lucide-react"

interface CourseData {
  _id: string
  title: string
  description: string
  category: string
  level: string
  duration: number
  price: number
  totalStudents: number
  rating: number
  lessonsCount: number
  teacher: {
    fullName: string
    email: string
  }
  status: string
  adminApproval: string
  createdAt: string
}

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) {
        setError('Course ID is required');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:3000/api/courses/${id}`);
        const data = await response.json();

        if (data.success) {
          setCourseData(data.data);
        } else {
          setError(data.message || 'Failed to fetch course data');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
        setError('Failed to fetch course data');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin khóa học...</p>
        </div>
      </div>
    );
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy khóa học</h3>
          <p className="text-gray-600 mb-4">{error || 'Khóa học không tồn tại'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{courseData.category}</span>
            <span>•</span>
            <span>{courseData.level}</span>
            <span>•</span>
            <span>Giảng viên: {courseData.teacher?.fullName || 'Unknown'}</span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{courseData.title}</h1>
          
          <p className="text-lg text-gray-600 mb-6">{courseData.description}</p>
          
          {/* Course Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Thời lượng</p>
                <p className="font-semibold">{courseData.duration} giờ</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Bài học</p>
                <p className="font-semibold">{courseData.lessonsCount}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Học viên</p>
                <p className="font-semibold">{courseData.totalStudents}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm text-gray-500">Đánh giá</p>
                <p className="font-semibold">{courseData.rating.toFixed(1)}/5</p>
              </div>
            </div>
          </div>
          
          {/* Status Badges */}
          <div className="flex space-x-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              courseData.status === 'published' ? 'bg-green-100 text-green-800' :
              courseData.status === 'draft' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {courseData.status === 'published' ? 'Đã xuất bản' :
               courseData.status === 'draft' ? 'Bản nháp' : 'Đã lưu trữ'}
            </span>
            
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              courseData.adminApproval === 'approved' ? 'bg-green-100 text-green-800' :
              courseData.adminApproval === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {courseData.adminApproval === 'approved' ? 'Đã duyệt' :
               courseData.adminApproval === 'pending' ? 'Chờ duyệt' : 'Đã từ chối'}
            </span>
          </div>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Thông tin chi tiết</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả khóa học</h3>
                  <p className="text-gray-600">{courseData.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Thông tin giảng viên</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">{courseData.teacher?.fullName || 'Unknown'}</p>
                    <p className="text-gray-600">{courseData.teacher?.email || 'No email'}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Thông tin khóa học</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Danh mục</p>
                      <p className="font-medium">{courseData.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cấp độ</p>
                      <p className="font-medium">{courseData.level}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Giá</p>
                      <p className="font-medium">{courseData.price === 0 ? 'Miễn phí' : `$${courseData.price}`}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ngày tạo</p>
                      <p className="font-medium">{new Date(courseData.createdAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="text-center">
                <div className="mb-4">
                  <span className="text-3xl font-bold text-orange-500">
                    {courseData.price === 0 ? 'Miễn phí' : `$${courseData.price}`}
                  </span>
                </div>
                
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4">
                  Xem khóa học
                </button>
                
                <div className="text-sm text-gray-600">
                  <p>✓ Truy cập vĩnh viễn</p>
                  <p>✓ Chứng chỉ hoàn thành</p>
                  <p>✓ Hỗ trợ 24/7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
