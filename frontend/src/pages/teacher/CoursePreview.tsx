import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Plus, 
  Eye, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  Play,
  FileText,
  Headphones
} from 'lucide-react';

interface Lesson {
  _id: string;
  title: string;
  description: string;
  duration: number;
  type: 'video' | 'text' | 'quiz' | 'audio';
  order: number;
  status: 'draft' | 'published';
}

interface Course {
  _id: string;
  title: string;
  description: string;
  level: string;
  category: string;
  thumbnail?: string;
  duration: number;
  lessonsCount: number;
  tags: string[];
  difficulty: number;
  rating: number;
  totalStudents: number;
  price: number;
  requirements?: string[];
  objectives?: string[];
  status: 'draft' | 'published' | 'archived';
  adminApproval: 'pending' | 'approved' | 'rejected';
  lessons: Lesson[];
  teacher: any;
}

export default function CoursePreview() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setCourse(data.data);
      } else {
        alert('Không thể tải thông tin khóa học');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      alert('Có lỗi xảy ra khi tải khóa học');
    } finally {
      setLoading(false);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="w-4 h-4" />;
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'audio':
        return <Headphones className="w-4 h-4" />;
      case 'quiz':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalColor = (approval: string) => {
    switch (approval) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy khóa học</h2>
          <Button onClick={() => navigate('/teacher')}>Quay lại Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/teacher')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Xem trước khóa học</h1>
              <p className="text-gray-600">Quản lý và xem trước khóa học của bạn</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => navigate(`/teacher/courses/${courseId}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Button>
            <Button
              onClick={() => navigate(`/teacher/courses/${courseId}/lessons/create`)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Thêm bài học
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{course.title}</CardTitle>
                  <div className="flex space-x-2">
                    <Badge className={getStatusColor(course.status)}>
                      {course.status === 'published' ? 'Đã xuất bản' : 
                       course.status === 'draft' ? 'Bản nháp' : 'Đã lưu trữ'}
                    </Badge>
                    <Badge className={getApprovalColor(course.adminApproval)}>
                      {course.adminApproval === 'approved' ? 'Đã duyệt' :
                       course.adminApproval === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Course Image */}
                  <div className="relative">
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=250&fit=crop'}
                      alt={course.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {course.category}
                      </Badge>
                    </div>
                  </div>

                  {/* Course Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Clock className="w-5 h-5 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-600">Thời lượng</p>
                      <p className="font-semibold">{course.duration} giờ</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <BookOpen className="w-5 h-5 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-600">Bài học</p>
                      <p className="font-semibold">{course.lessonsCount}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Users className="w-5 h-5 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-600">Học viên</p>
                      <p className="font-semibold">{course.totalStudents}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                      </div>
                      <p className="text-sm text-gray-600">Đánh giá</p>
                      <p className="font-semibold">{course.rating.toFixed(1)}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Mô tả</h3>
                    <p className="text-gray-600">{course.description}</p>
                  </div>

                  {/* Tags */}
                  {course.tags && course.tags.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {course.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {course.requirements && course.requirements.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Yêu cầu</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {course.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Objectives */}
                  {course.objectives && course.objectives.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Mục tiêu</h3>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {course.objectives.map((obj, index) => (
                          <li key={index}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lessons List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Danh sách bài học</CardTitle>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/teacher/courses/${courseId}/lessons/create`)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {course.lessons && course.lessons.length > 0 ? (
                    course.lessons
                      .sort((a, b) => a.order - b.order)
                      .map((lesson) => (
                        <div
                          key={lesson._id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-gray-500">
                              {getLessonIcon(lesson.type)}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{lesson.title}</p>
                              <p className="text-xs text-gray-500">{lesson.duration} phút</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={lesson.status === 'published' ? 'text-green-600' : 'text-yellow-600'}
                            >
                              {lesson.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => navigate(`/teacher/courses/${courseId}/lessons/${lesson._id}/edit`)}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">Chưa có bài học nào</p>
                      <Button
                        onClick={() => navigate(`/teacher/courses/${courseId}/lessons/create`)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Tạo bài học đầu tiên
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
