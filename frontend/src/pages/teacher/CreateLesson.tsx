import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { ArrowLeft, Save, Eye, Plus, X, BookOpen, Video, FileText, Headphones, CheckCircle } from 'lucide-react';
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

  // Helper function to convert YouTube URL to embed format
  const convertToEmbedUrl = (url: string): string => {
    if (!url) return '';
    
    // YouTube watch URL pattern
    const watchPattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
    const match = url.match(watchPattern);
    
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    
    // Already embed URL
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    return url;
  };

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
      const response = await apiService.getCourseDetail(courseId || '');
      const data = response;

      if (data.success) {
        setCourse(data.data);
      } else {
        alert('Không thể tải thông tin khóa học');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      alert('Có lỗi xảy ra khi tải khóa học');
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
      // Prepare data to send
      const dataToSend: any = {
        ...formData,
        course: courseId
      };

      // Only include videoUrl if type is video and it has a value
      if (formData.type === 'video' && formData.videoUrl) {
        dataToSend.videoUrl = convertToEmbedUrl(formData.videoUrl);
      } else if (formData.type === 'video') {
        dataToSend.videoUrl = undefined;
      }

      // Only include audioUrl if type is audio and it has a value
      if (formData.type === 'audio' && formData.audioUrl) {
        dataToSend.audioUrl = formData.audioUrl;
      } else if (formData.type === 'audio') {
        dataToSend.audioUrl = undefined;
      }

      console.log('Sending data to backend:', dataToSend);

      const response = await apiService.createLesson(dataToSend);

      if (response.success) {
        alert('Bài học đã được tạo thành công!');
        navigate(`/teacher/courses/${courseId}/preview`);
      } else {
        alert('Lỗi: ' + response.message);
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
                        URL Video *
                      </label>
                      <Input
                        value={formData.videoUrl}
                        onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... hoặc https://youtu.be/..."
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Hỗ trợ YouTube URLs. Hệ thống sẽ tự động chuyển đổi sang định dạng embed.
                      </p>
                      {formData.videoUrl && (
                        <div className="mt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleInputChange('videoUrl', convertToEmbedUrl(formData.videoUrl || ''))}
                          >
                            Chuyển đổi sang Embed URL
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {formData.type === 'audio' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Audio *
                      </label>
                      <Input
                        value={formData.audioUrl}
                        onChange={(e) => handleInputChange('audioUrl', e.target.value)}
                        placeholder="https://example.com/audio.mp3"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Hỗ trợ các định dạng audio: MP3, OGG, WAV
                      </p>
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
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <iframe
                        src={convertToEmbedUrl(formData.videoUrl)}
                        title="Video Preview"
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}

                  {formData.type === 'audio' && formData.audioUrl && (
                    <div className="bg-gray-100 rounded-lg p-4">
                      <audio controls className="w-full">
                        <source src={formData.audioUrl} type="audio/mpeg" />
                        <source src={formData.audioUrl} type="audio/ogg" />
                        <source src={formData.audioUrl} type="audio/wav" />
                        Trình duyệt của bạn không hỗ trợ phát audio.
                      </audio>
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
