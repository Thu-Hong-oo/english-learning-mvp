import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { apiService } from '../../services/api';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  BookOpen,
  Award,
  CheckCircle
} from 'lucide-react';
import { useAppSelector } from '../../store/hooks'

interface ProfileForm {
  fullName: string
  email: string
  phone: string
  bio: string
  location: string
  website: string
  linkedin: string
  github: string
  expertise: string[]
  education: string
  experience: string
  certifications: string[]
  languages: string[]
}

export default function TeacherProfile() {
  const [formData, setFormData] = useState<ProfileForm>({
    fullName: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    website: '',
    linkedin: '',
    github: '',
    expertise: [],
    education: '',
    experience: '',
    certifications: [],
    languages: []
  })
  const [newExpertise, setNewExpertise] = useState('')
  const [newCertification, setNewCertification] = useState('')
  const [newLanguage, setNewLanguage] = useState('')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const { user } = useAppSelector(state => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'teacher') {
      navigate('/login')
      return
    }
    
    fetchProfile()
  }, [user, navigate])

  const fetchProfile = async () => {
    try {
      const response = await apiService.getUserProfile();

      if (response.success) {
        const profile = response.data;
        setFormData({
          fullName: profile.fullName || '',
          email: profile.email || '',
          phone: profile.phone || '',
          bio: profile.bio || '',
          location: profile.location || '',
          website: profile.website || '',
          linkedin: profile.linkedin || '',
          github: profile.github || '',
          expertise: profile.expertise || [],
          education: profile.education || '',
          experience: profile.experience || '',
          certifications: profile.certifications || [],
          languages: profile.languages || []
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (field: keyof ProfileForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addExpertise = () => {
    if (newExpertise.trim() && !formData.expertise.includes(newExpertise.trim())) {
      handleInputChange('expertise', [...formData.expertise, newExpertise.trim()])
      setNewExpertise('')
    }
  }

  const removeExpertise = (expertise: string) => {
    handleInputChange('expertise', formData.expertise.filter(e => e !== expertise))
  }

  const addCertification = () => {
    if (newCertification.trim() && !formData.certifications.includes(newCertification.trim())) {
      handleInputChange('certifications', [...formData.certifications, newCertification.trim()])
      setNewCertification('')
    }
  }

  const removeCertification = (certification: string) => {
    handleInputChange('certifications', formData.certifications.filter(c => c !== certification))
  }

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      handleInputChange('languages', [...formData.languages, newLanguage.trim()])
      setNewLanguage('')
    }
  }

  const removeLanguage = (language: string) => {
    handleInputChange('languages', formData.languages.filter(l => l !== language))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await apiService.updateUserProfile(formData);

      if (response.success) {
        alert('Hồ sơ đã được cập nhật thành công!');
        navigate('/teacher');
      } else {
        alert(response.message || 'Có lỗi xảy ra khi cập nhật hồ sơ');
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Có lỗi xảy ra khi cập nhật hồ sơ')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải hồ sơ...</p>
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <User className="w-6 h-6" />
              Chỉnh sửa hồ sơ
            </CardTitle>
            <p className="text-sm text-gray-600">
              Cập nhật thông tin cá nhân và chuyên môn của bạn
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin cơ bản
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Họ và tên *</label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Nhập email"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Số điện thoại</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Địa chỉ</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Giới thiệu</label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Giới thiệu về bản thân và kinh nghiệm giảng dạy"
                    rows={4}
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Liên kết mạng xã hội</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Website</label>
                    <Input
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">LinkedIn</label>
                    <Input
                      value={formData.linkedin}
                      onChange={(e) => handleInputChange('linkedin', e.target.value)}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">GitHub</label>
                    <Input
                      value={formData.github}
                      onChange={(e) => handleInputChange('github', e.target.value)}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>
              </div>

              {/* Expertise */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Chuyên môn giảng dạy
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chứng chỉ chính</label>
                    <select
                      value={newExpertise}
                      onChange={(e) => setNewExpertise(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <div className="flex items-end">
                    <Button type="button" onClick={addExpertise} variant="outline" className="w-full">
                      Thêm chuyên môn
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.expertise.map((expertise, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeExpertise(expertise)}>
                      {expertise} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Education & Experience */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Học vấn & Kinh nghiệm
                </h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Học vấn</label>
                  <Textarea
                    value={formData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    placeholder="Mô tả về học vấn và bằng cấp"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Kinh nghiệm giảng dạy</label>
                  <Textarea
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Mô tả kinh nghiệm giảng dạy và làm việc"
                    rows={3}
                  />
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Chứng chỉ</h3>
                <div className="flex gap-2">
                  <Input
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    placeholder="Thêm chứng chỉ"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                  />
                  <Button type="button" onClick={addCertification} variant="outline">
                    Thêm
                  </Button>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {formData.certifications.map((cert, index) => (
                    <li key={index} className="text-gray-700 flex items-center justify-between">
                      <span>{cert}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertification(cert)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Languages */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Ngôn ngữ giảng dạy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Ngôn ngữ</label>
                    <select
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Chọn ngôn ngữ</option>
                      <option value="English">English</option>
                      <option value="Vietnamese">Vietnamese</option>
                      <option value="English-Vietnamese">English-Vietnamese</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button type="button" onClick={addLanguage} variant="outline" className="w-full">
                      Thêm ngôn ngữ
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.languages.map((language, index) => (
                    <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeLanguage(language)}>
                      {language} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => navigate('/teacher')}>
                  Hủy
                </Button>
                <Button type="submit" disabled={saving}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
