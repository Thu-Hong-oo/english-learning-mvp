import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { apiService } from '../../services/api';

interface LessonFormData {
  title: string;
  description: string;
  content: string;
  duration: number;
  type: 'video' | 'text' | 'quiz' | 'audio';
  videoUrl?: string;
  audioUrl?: string;
  order: number;
}

export default function CreateLesson() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [formData, setFormData] = useState<LessonFormData>({
    title: '',
    description: '',
    content: '',
    duration: 30,
    type: 'video',
    videoUrl: '',
    order: 1
  });

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      const response = await apiService.getCourseDetail(courseId!);
      if (response.success) {
        setCourse(response.data);
        // Set order to next available number
        setFormData(prev => ({
          ...prev,
          order: (response.data.lessons?.length || 0) + 1
        }));
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  const handleInputChange = (field: keyof LessonFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/api/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          course: courseId
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('Bài học đã được tạo thành công!');
        navigate(`/teacher/courses/${courseId}/preview`);
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('Có lỗi xảy ra khi tạo bài học');
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
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
              onClick={() => navigate(`/teacher/courses/${courseId}/preview`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tạo bài học mới</h1>
              <p className="text-gray-600">Khóa học: {course.title}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bài học</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề bài học *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Nhập tiêu đề bài học"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả ngắn *
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Mô tả ngắn về bài học"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loại bài học *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="video">Video</option>
                        <option value="text">Văn bản</option>
                        <option value="quiz">Quiz</option>
                        <option value="audio">Audio</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời lượng (phút) *
                      </label>
                      <Input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Thứ tự bài học *
                    </label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => handleInputChange('order', parseInt(e.target.value))}
                      min="1"
                      required
                    />
                  </div>

                  {formData.type === 'video' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Video
                      </label>
                      <Input
                        value={formData.videoUrl}
                        onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                        placeholder="https://www.youtube.com/embed/..."
                      />
                    </div>
                  )}

                  {formData.type === 'audio' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Audio
                      </label>
                      <Input
                        value={formData.audioUrl}
                        onChange={(e) => handleInputChange('audioUrl', e.target.value)}
                        placeholder="https://example.com/audio.mp3"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nội dung bài học *
                    </label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Nhập nội dung chi tiết của bài học..."
                      rows={10}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(`/teacher/courses/${courseId}/preview`)}
                    >
                      Hủy
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Tạo bài học
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Xem trước
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">{formData.title || 'Tiêu đề bài học'}</h3>
                    <p className="text-sm text-gray-600">{formData.description || 'Mô tả bài học'}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Loại: {formData.type}</span>
                    <span>Thời lượng: {formData.duration} phút</span>
                    <span>Thứ tự: {formData.order}</span>
                  </div>

                  {formData.type === 'video' && formData.videoUrl && (
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-500">Video Preview</span>
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-2">Nội dung:</p>
                    <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                      {formData.content || 'Nội dung bài học sẽ hiển thị ở đây...'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
