import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Clock, Users, BookOpen, Play, ArrowLeft, ArrowRight, CheckCircle, Lock } from 'lucide-react'
import { apiService } from '../services/api'
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
  content?: string
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

export default function LearnPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId?: string }>();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Debug logging
  console.log('LearnPage - User info:', { 
    userId: user?._id, 
    role: user?.role 
  });
  console.log('LearnPage - Course ID:', courseId);
  console.log('LearnPage - Course data:', courseData);

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        setError('Course ID is required');
        setLoading(false);
        return;
      }

      try {
        // Fetch course data
        const courseResponse = await apiService.getCourseDetail(courseId);
        const courseData = courseResponse;
        
        if (courseData.success) {
          // Fetch lessons based on user role
          let lessonsResponse;
          
          if (user?.role === 'teacher') {
            // Teacher can see all lessons (including drafts)
            console.log('👨‍🏫 Fetching all lessons for teacher...');
            lessonsResponse = await apiService.getLessonsByCourse(courseId);
          } else {
            // Students can only see published lessons
            console.log('👨‍🎓 Fetching published lessons for student...');
            lessonsResponse = await apiService.getLessonsByCoursePublic(courseId);
          }
          
          if (lessonsResponse.success) {
            const lessonsData = lessonsResponse.data.sort((a: Lesson, b: Lesson) => a.order - b.order);
            
            setCourseData({
              ...courseData.data,
              lessons: lessonsData
            });

            // Set current lesson based on lessonId from URL or first lesson
            if (lessonId) {
              const targetLesson = lessonsData.find((lesson: Lesson) => lesson._id === lessonId);
              if (targetLesson) {
                setCurrentLesson(targetLesson);
              } else if (lessonsData.length > 0) {
                setCurrentLesson(lessonsData[0]);
              }
            } else if (lessonsData.length > 0) {
              setCurrentLesson(lessonsData[0]);
            }
          } else {
            console.log('❌ Lessons response not successful:', lessonsResponse);
            setCourseData({
              ...courseData.data,
              lessons: []
            });
          }
        } else {
          console.log('❌ Course response not successful:', courseData);
          setError('Không thể tải thông tin khóa học');
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  const handleLessonSelect = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    // Update URL to reflect current lesson
    navigate(`/courses/${courseId}/lessons/${lesson._id}/learn`, { replace: true });
  };

  const handleBackToCourse = () => {
    navigate(`/courses/${courseId}`);
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'text':
        return <BookOpen className="w-4 h-4" />;
      case 'audio':
        return <Users className="w-4 h-4" />;
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy khóa học</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={handleBackToCourse} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy khóa học</h1>
          <p className="text-gray-600 mb-6">Course data is null</p>
          <Button onClick={handleBackToCourse} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button onClick={handleBackToCourse} variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại khóa học
              </Button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-lg font-semibold text-gray-900">{courseData.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Lesson List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Danh sách bài học</h2>
              
              {courseData.lessons && courseData.lessons.length > 0 ? (
                <div className="space-y-2">
                  {courseData.lessons.map((lesson) => (
                    <button
                      key={lesson._id}
                      onClick={() => handleLessonSelect(lesson)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentLesson?._id === lesson._id
                          ? 'bg-blue-50 border border-blue-200 text-blue-900'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-600">
                          {getLessonIcon(lesson.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{lesson.title}</p>
                          <p className="text-xs text-gray-500">{lesson.duration} phút</p>
                        </div>
                        <div className="text-xs text-gray-400">{lesson.order}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-6xl mb-4">📚</div>
                  <p className="text-gray-500 text-sm">Chưa có bài học nào</p>
                  <p className="text-gray-400 text-xs mt-1">Giảng viên chưa tạo bài học</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Content - Lesson Display */}
          <div className="lg:col-span-3">
            {currentLesson ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="mb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-blue-600">
                      {getLessonIcon(currentLesson.type)}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">{currentLesson.title}</h2>
                  </div>
                  <p className="text-gray-600 mb-4">{currentLesson.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{currentLesson.duration} phút</span>
                    </span>
                    <span className="capitalize">{currentLesson.type}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Đã xuất bản
                    </span>
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="border-t pt-6">
                  {currentLesson.type === 'video' && currentLesson.videoUrl && (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
                      <iframe
                        src={currentLesson.videoUrl}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  )}

                  {currentLesson.type === 'audio' && currentLesson.audioUrl && (
                    <div className="bg-gray-100 rounded-lg p-6 mb-4">
                      <audio controls className="w-full">
                        <source src={currentLesson.audioUrl} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}

                  {currentLesson.content && (
                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
                    </div>
                  )}

                  {currentLesson.type === 'quiz' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 text-sm">
                        Bài kiểm tra này sẽ được hiển thị ở đây. Tính năng đang được phát triển.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">📖</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Chọn bài học để bắt đầu</h3>
                  <p className="text-gray-500">
                    Chọn một bài học từ danh sách bên trái để bắt đầu học
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
