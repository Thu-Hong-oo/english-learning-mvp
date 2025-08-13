import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Textarea } from '../../components/ui/textarea'
import { Badge } from '../../components/ui/badge'
import { ArrowLeft, Upload, Save, Eye } from 'lucide-react'

interface CourseForm {
  title: string
  description: string
  price: number
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number
  thumbnail: string
  tags: string[]
  requirements: string[]
  objectives: string[]
}

export default function CreateCourse() {
  const [formData, setFormData] = useState<CourseForm>({
    title: '',
    description: '',
    price: 0,
    category: '',
    level: 'beginner',
    duration: 0,
    thumbnail: '',
    tags: [],
    requirements: [],
    objectives: []
  })
  const [newTag, setNewTag] = useState('')
  const [newRequirement, setNewRequirement] = useState('')
  const [newObjective, setNewObjective] = useState('')
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState(false)

  const navigate = useNavigate()

  const handleInputChange = (field: keyof CourseForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()])
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    handleInputChange('tags', formData.tags.filter(t => t !== tag))
  }

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      handleInputChange('requirements', [...formData.requirements, newRequirement.trim()])
      setNewRequirement('')
    }
  }

  const removeRequirement = (requirement: string) => {
    handleInputChange('requirements', formData.requirements.filter(r => r !== requirement))
  }

  const addObjective = () => {
    if (newObjective.trim() && !formData.objectives.includes(newObjective.trim())) {
      handleInputChange('objectives', [...formData.objectives, newObjective.trim()])
      setNewObjective('')
    }
  }

  const removeObjective = (objective: string) => {
    handleInputChange('objectives', formData.objectives.filter(o => o !== objective))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      // Validate required fields
      if (!formData.title || !formData.description || !formData.category || !formData.level) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc')
        setLoading(false)
        return
      }

      const courseData = {
        ...formData,
        duration: formData.duration || 0,
        price: formData.price || 0,
        createdBy: 'temp', // Will be set by backend
        lessonsCount: 0
      }

      const response = await fetch('http://localhost:3000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(courseData)
      })

      const data = await response.json()

      if (data.success) {
        alert('Khóa học đã được tạo thành công!')
        navigate('/teacher')
      } else {
        alert(data.message || 'Có lỗi xảy ra khi tạo khóa học')
      }
    } catch (error) {
      console.error('Error creating course:', error)
      alert('Có lỗi xảy ra khi tạo khóa học')
    } finally {
      setLoading(false)
    }
  }

  if (preview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="outline" onClick={() => setPreview(false)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại chỉnh sửa
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Đang tạo...' : 'Tạo khóa học'}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{formData.title}</CardTitle>
              <CardDescription>{formData.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Thông tin khóa học</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Danh mục:</span>
                      <span>{formData.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cấp độ:</span>
                      <Badge>{formData.level}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Thời lượng:</span>
                      <span>{formData.duration} giờ</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giá:</span>
                      <span className="font-semibold">${formData.price}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {formData.requirements.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Yêu cầu</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {formData.requirements.map((req, index) => (
                      <li key={index} className="text-gray-700">{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {formData.objectives.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Mục tiêu học tập</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {formData.objectives.map((obj, index) => (
                      <li key={index} className="text-gray-700">{obj}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => navigate('/teacher')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại Dashboard
          </Button>
          <Button onClick={() => setPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Xem trước
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Tạo khóa học mới</CardTitle>
            <CardDescription>
              Điền thông tin chi tiết về khóa học của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thông tin cơ bản</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tiêu đề khóa học *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Nhập tiêu đề khóa học"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Mô tả *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Mô tả chi tiết về khóa học"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chứng chỉ *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Chọn chứng chỉ</option>
                      <option value="TOEIC">TOEIC</option>
                      <option value="IELTS">IELTS</option>
                      <option value="TOEFL">TOEFL</option>
                      <option value="Cambridge">Cambridge (KET, PET, FCE, CAE, CPE)</option>
                      <option value="Business English">Business English</option>
                      <option value="General English">General English</option>
                      <option value="Conversation">Conversation</option>
                      <option value="Grammar">Grammar</option>
                      <option value="Vocabulary">Vocabulary</option>
                      <option value="Pronunciation">Pronunciation</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cấp độ *</label>
                    <select
                      value={formData.level}
                      onChange={(e) => handleInputChange('level', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Chọn cấp độ</option>
                      <option value="beginner">Beginner (A1-A2)</option>
                      <option value="intermediate">Intermediate (B1-B2)</option>
                      <option value="advanced">Advanced (C1-C2)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Thời lượng (giờ) *</label>
                    <Input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Giá ($) *</label>
                    <Input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Thumbnail URL</label>
                    <Input
                      value={formData.thumbnail}
                      onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Tags</h3>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Thêm tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    Thêm
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Yêu cầu</h3>
                <div className="flex gap-2">
                  <Input
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                    placeholder="Thêm yêu cầu"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                  />
                  <Button type="button" onClick={addRequirement} variant="outline">
                    Thêm
                  </Button>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {formData.requirements.map((req, index) => (
                    <li key={index} className="text-gray-700 flex items-center justify-between">
                      <span>{req}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRequirement(req)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Learning Objectives */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Mục tiêu học tập</h3>
                <div className="flex gap-2">
                  <Input
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Thêm mục tiêu"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addObjective())}
                  />
                  <Button type="button" onClick={addObjective} variant="outline">
                    Thêm
                  </Button>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {formData.objectives.map((obj, index) => (
                    <li key={index} className="text-gray-700 flex items-center justify-between">
                      <span>{obj}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeObjective(obj)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/teacher')}>
                  Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Đang tạo...' : 'Tạo khóa học'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
