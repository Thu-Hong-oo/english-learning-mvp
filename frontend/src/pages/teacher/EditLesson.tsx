import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { apiService } from '../../services/api';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  BookOpen, 
  Video, 
  FileText, 
  Headphones,
  CheckCircle
} from 'lucide-react';

interface LessonFormData {
  title: string;
  description: string;
  content: string;
  duration: number;
  type: 'video' | 'text' | 'quiz' | 'audio';
  videoUrl?: string;
  audioUrl?: string;
  order: number;
  status: 'draft' | 'published';
}

export default function EditLesson() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState<any>(null);
  const [formData, setFormData] = useState<LessonFormData>({
    title: '',
    description: '',
    content: '',
    duration: 30,
    type: 'video',
    videoUrl: '',
    audioUrl: '',
    order: 1,
    status: 'draft'
  });

  useEffect(() => {
    if (lessonId) {
      fetchLessonDetails();
    }
  }, [lessonId]);

  const fetchLessonDetails = async () => {
    try {
      const response = await apiService.getLessonDetail(lessonId || '');
      const data = response;

      if (data.success) {
        setFormData(data.data);
      } else {
        alert('Không thể tải thông tin bài học');
      }
    } catch (error) {
      console.error('Error fetching lesson:', error);
      alert('Có lỗi xảy ra khi tải bài học');
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
      const response = await apiService.updateLesson(lessonId || '', formData);
      const data = response;

      if (data.success) {
        alert('Bài học đã được cập nhật thành công!');
        navigate(`/teacher/courses/${courseId}/preview`);
      } else {
        alert('Lỗi: ' + (data.message || 'Không thể cập nhật bài học'));
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
      alert('Có lỗi xảy ra khi cập nhật bài học');
    } finally {
      setLoading(false);
    }
  };

  if (!lesson) {
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
              <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa bài học</h1>
              <p className="text-gray-600">Cập nhật thông tin bài học</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bài học</CardTitle>
                {/* Status notification */}
                <div className={`mt-2 p-3 rounded-lg ${
                  formData.status === 'published' 
                    ? 'bg-green-50 border border-green-200 text-green-800' 
                    : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
                }`}>
                  <div className="flex items-center space-x-2">
                    {formData.status === 'published' ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Bài học đã xuất bản - Học viên có thể xem và học</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Bài học đang ở trạng thái bản nháp - Học viên không thể xem</span>
                      </>
                    )}
                  </div>
                </div>
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

                  <div className="grid grid-cols-2 gap-4">
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trạng thái bài học *
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => handleInputChange('status', e.target.value as 'draft' | 'published')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="draft">Bản nháp</option>
                        <option value="published">Đã xuất bản</option>
                      </select>
                    </div>
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
                    
                    {/* Quick publish button */}
                    {formData.status === 'draft' && (
                      <Button
                        type="button"
                        onClick={() => handleInputChange('status', 'published')}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Xuất bản ngay
                      </Button>
                    )}
                    
                    <Button type="submit" disabled={loading}>
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      )}
                      Cập nhật bài học
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
                  <BookOpen className="w-4 h-4 mr-2" />
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
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      formData.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {formData.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                    </span>
                  </div>

                  {formData.type === 'video' && formData.videoUrl && (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <iframe
                        src={formData.videoUrl}
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
