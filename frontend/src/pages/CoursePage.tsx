
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Star, Users, BookOpen, Clock, Award, Plus, Play, Lock } from "lucide-react"
import { useAppSelector } from "../store/hooks"
import { Button } from "../components/ui/button"

interface Lesson {
  _id: string
  title: string
  description: string
  duration: number
  type: 'video' | 'text' | 'quiz' | 'audio'
  order: number
  status: string
  videoUrl?: string
  audioUrl?: string
}

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
    _id: string
    fullName: string
    email: string
  }
  status: string
  adminApproval: string
  createdAt: string
  lessons?: Lesson[]
}

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is the teacher of this course
  const isTeacher = user?.role === 'teacher' && user?.userId === courseData?.teacher?._id;
  const isStudent = user?.role === 'student';

  // Debug logging
  console.log('User info:', { 
    userId: user?.userId, 
    role: user?.role, 
    teacherId: courseData?.teacher?._id 
  });
  console.log('Role checks:', { isTeacher, isStudent });
  console.log('Course data:', courseData);

  // Handler functions
  const handleAddLesson = () => {
    navigate(`/teacher/courses/${id}/create-lesson`);
  };

  const handleStartLearning = (lessonId: string) => {
    navigate(`/courses/${id}/lessons/${lessonId}/learn`);
  };

  const handleViewLesson = (lessonId: string) => {
    navigate(`/courses/${id}/lessons/${lessonId}`);
  };

  const handleToggleLessonStatus = async (lessonId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/lessons/${lessonId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        // Refresh the page to show updated status
        window.location.reload();
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (error) {
      console.error('Error toggling lesson status:', error);
      alert('Có lỗi xảy ra khi thay đổi trạng thái bài học');
    }
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!id) {
        setError('Course ID is required');
        setLoading(false);
        return;
      }

      try {
        // Fetch course data
        const courseResponse = await fetch(`http://localhost:3000/api/courses/${id}`);
        const courseData = await courseResponse.json();

        if (courseData.success) {
          // Fetch lessons for this course based on user role
          let lessons = [];
          if (user?.role === 'teacher') {
            // Teacher can see all lessons (including drafts)
            const lessonsResponse = await fetch(`http://localhost:3000/api/lessons/course/${id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            if (lessonsResponse.ok) {
              const lessonsData = await lessonsResponse.json();
              if (lessonsData.success) {
                lessons = lessonsData.data;
              }
            }
          } else {
            // Students can only see published lessons
            const lessonsResponse = await fetch(`http://localhost:3000/api/lessons/course/${id}/public`);
            
            if (lessonsResponse.ok) {
              const lessonsData = await lessonsResponse.json();
              if (lessonsData.success) {
                lessons = lessonsData.data;
              }
            }
          }

          setCourseData({
            ...courseData.data,
            lessons: lessons
          });
        } else {
          setError(courseData.message || 'Failed to fetch course data');
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

          {/* Lessons Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Danh sách bài học</h2>
                {isTeacher && (
                  <Button
                    onClick={handleAddLesson}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm bài học
                  </Button>
                )}
              </div>
              
              {isTeacher && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-800 mb-4">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">
                      Lưu ý: Chỉ bài học có trạng thái "Đã xuất bản" mới hiển thị cho học viên. 
                      Sử dụng nút "Xuất bản" để cho phép học viên học bài học.
                    </span>
                  </div>
                  
                  {/* Test button */}
                  <Button
                    onClick={() => {
                      console.log('Testing API...');
                      fetch(`http://localhost:3000/api/lessons/${courseData.lessons?.[0]?._id}/toggle-status`, {
                        method: 'PATCH',
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                      })
                      .then(res => res.json())
                      .then(data => console.log('API Response:', data))
                      .catch(err => console.error('API Error:', err));
                    }}
                    variant="outline"
                    size="sm"
                    className="bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200"
                  >
                    🧪 Test API
                  </Button>
                </div>
              )}
              
              {courseData.lessons && courseData.lessons.length > 0 ? (
                <div className="space-y-4">
                  {courseData.lessons.map((lesson, index) => (
                    <div
                      key={lesson._id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                            {lesson.order}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">{lesson.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{lesson.duration} phút</span>
                              </span>
                              <span className="capitalize">{lesson.type}</span>
                              {isTeacher && (
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  lesson.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                  {lesson.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {/* Debug info */}
                          {isTeacher && (
                            <span className="text-xs text-red-500">
                              Teacher: {user?.userId} | Course Teacher: {courseData?.teacher?._id}
                            </span>
                          )}
                          
                          {isStudent ? (
                            <Button
                              onClick={() => handleStartLearning(lesson._id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                              size="sm"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Vào học
                            </Button>
                          ) : (
                            <>
                              <Button
                                onClick={() => handleViewLesson(lesson._id)}
                                variant="outline"
                                size="sm"
                              >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Xem
                              </Button>
                              
                              {/* Always show publish button for debugging */}
                              <Button
                                onClick={() => handleToggleLessonStatus(lesson._id)}
                                variant={lesson.status === 'published' ? 'outline' : 'default'}
                                size="sm"
                                className={lesson.status === 'published' 
                                  ? 'border-orange-500 text-orange-600 hover:bg-orange-50' 
                                  : 'bg-green-600 hover:bg-green-700 text-white'
                                }
                              >
                                {lesson.status === 'published' ? (
                                  <>
                                    <Lock className="w-4 h-4 mr-2" />
                                    Ẩn
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Xuất bản
                                  </>
                                )}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <BookOpen className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isTeacher ? 'Chưa có bài học nào' : 'Chưa có bài học nào được xuất bản'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {isTeacher 
                      ? 'Hãy tạo bài học đầu tiên để bắt đầu khóa học' 
                      : 'Hãy quay lại sau khi giảng viên xuất bản bài học'
                    }
                  </p>
                  {isTeacher && (
                    <Button
                      onClick={handleAddLesson}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Tạo bài học đầu tiên
                    </Button>
                  )}
                </div>
              )}
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
                
                {isStudent ? (
                  <button 
                    onClick={() => courseData.lessons && courseData.lessons.length > 0 && handleStartLearning(courseData.lessons[0]._id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!courseData.lessons || courseData.lessons.length === 0}
                  >
                    {courseData.lessons && courseData.lessons.length > 0 ? 'Bắt đầu học' : 'Chưa có bài học'}
                  </button>
                ) : (
                  <button 
                    onClick={() => courseData.lessons && courseData.lessons.length > 0 && courseData.lessons[0] && handleViewLesson(courseData.lessons[0]._id)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!courseData.lessons || courseData.lessons.length === 0}
                  >
                    {courseData.lessons && courseData.lessons.length > 0 ? 'Xem bài học' : 'Chưa có bài học'}
                  </button>
                )}
                
                <div className="text-sm text-gray-600">
                  <p>✓ Truy cập vĩnh viễn</p>
                  <p>✓ Chứng chỉ hoàn thành</p>
                  <p>✓ Hỗ trợ 24/7</p>
                  {!courseData.lessons || courseData.lessons.length === 0 ? (
                    <p className="text-orange-600 font-medium mt-2">
                      ⚠️ {isTeacher ? 'Chưa có bài học nào' : 'Chưa có bài học nào được xuất bản'}
                    </p>
                  ) : (
                    <p className="text-green-600 font-medium mt-2">
                      ✓ {courseData.lessons.length} bài học sẵn sàng
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
