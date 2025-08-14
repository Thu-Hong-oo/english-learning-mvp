import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Save, Eye } from 'lucide-react';

interface CourseFormData {
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: 'TOEIC' | 'IELTS' | 'TOEFL' | 'Cambridge' | 'Business English' | 'General English' | 'Conversation' | 'Grammar' | 'Vocabulary' | 'Pronunciation';
  thumbnail?: string;
  duration: number;
  price: number;
  tags: string[];
  requirements: string[];
  objectives: string[];
  difficulty: number;
}

export default function EditCourse() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    level: 'intermediate',
    category: 'General English',
    thumbnail: '',
    duration: 0,
    price: 0,
    tags: [],
    requirements: [],
    objectives: [],
    difficulty: 1
  });

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
        setFormData({
          title: data.data.title || '',
          description: data.data.description || '',
          level: data.data.level || 'intermediate',
          category: data.data.category || 'General English',
          thumbnail: data.data.thumbnail || '',
          duration: data.data.duration || 0,
          price: data.data.price || 0,
          tags: data.data.tags || [],
          requirements: data.data.requirements || [],
          objectives: data.data.objectives || [],
          difficulty: data.data.difficulty || 1
        });
      } else {
        alert('Không thể tải thông tin khóa học');
      }
    } catch (error) {
      console.error('Error fetching course:', error);
      alert('Có lỗi xảy ra khi tải khóa học');
    }
  };

  const handleInputChange = (field: keyof CourseFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayInputChange = (field: 'tags' | 'requirements' | 'objectives', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/api/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert('Khóa học đã được cập nhật thành công!');
        navigate(`/teacher/courses/${courseId}/preview`);
      } else {
        alert('Lỗi: ' + data.message);
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Có lỗi xảy ra khi cập nhật khóa học');
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
              <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa khóa học</h1>
              <p className="text-gray-600">Cập nhật thông tin khóa học</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin khóa học</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tiêu đề khóa học *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Nhập tiêu đề khóa học"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mô tả *
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Mô tả chi tiết về khóa học"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Trình độ *
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) => handleInputChange('level', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="beginner">Cơ bản</option>
                        <option value="intermediate">Trung cấp</option>
                        <option value="advanced">Nâng cao</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Danh mục *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="TOEIC">TOEIC</option>
                        <option value="IELTS">IELTS</option>
                        <option value="TOEFL">TOEFL</option>
                        <option value="Cambridge">Cambridge</option>
                        <option value="Business English">Business English</option>
                        <option value="General English">General English</option>
                        <option value="Conversation">Conversation</option>
                        <option value="Grammar">Grammar</option>
                        <option value="Vocabulary">Vocabulary</option>
                        <option value="Pronunciation">Pronunciation</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thời lượng (giờ) *
                      </label>
                      <Input
                        type="number"
                        value={formData.duration}
                        onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Giá (USD) *
                      </label>
                      <Input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Độ khó (1-5) *
                      </label>
                      <Input
                        type="number"
                        value={formData.difficulty}
                        onChange={(e) => handleInputChange('difficulty', parseInt(e.target.value))}
                        min="1"
                        max="5"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL ảnh bìa
                    </label>
                    <Input
                      value={formData.thumbnail}
                      onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (phân cách bằng dấu phẩy)
                    </label>
                    <Input
                      value={formData.tags.join(', ')}
                      onChange={(e) => handleArrayInputChange('tags', e.target.value)}
                      placeholder="TOEIC, Business English, Test Preparation"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yêu cầu (phân cách bằng dấu phẩy)
                    </label>
                    <Textarea
                      value={formData.requirements.join(', ')}
                      onChange={(e) => handleArrayInputChange('requirements', e.target.value)}
                      placeholder="Basic English knowledge, Intermediate reading skills"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mục tiêu (phân cách bằng dấu phẩy)
                    </label>
                    <Textarea
                      value={formData.objectives.join(', ')}
                      onChange={(e) => handleArrayInputChange('objectives', e.target.value)}
                      placeholder="Achieve TOEIC score 700+, Master business vocabulary"
                      rows={3}
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
                      Cập nhật khóa học
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
                    <h3 className="font-semibold text-gray-900">{formData.title || 'Tiêu đề khóa học'}</h3>
                    <p className="text-sm text-gray-600">{formData.description || 'Mô tả khóa học'}</p>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <Badge variant="outline">{formData.level}</Badge>
                    <Badge variant="outline">{formData.category}</Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Thời lượng</p>
                      <p className="font-semibold">{formData.duration} giờ</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Giá</p>
                      <p className="font-semibold">${formData.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Độ khó</p>
                      <p className="font-semibold">{formData.difficulty}/5</p>
                    </div>
                  </div>

                  {formData.thumbnail && (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={formData.thumbnail}
                        alt="Course thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {formData.tags.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
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
