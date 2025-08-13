import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Textarea} from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { useAppSelector } from '../store/hooks'
import { User, BookOpen, Award, Link, Upload, CheckCircle, XCircle } from 'lucide-react'

interface ApplicationForm {
  email: string
  fullName: string
  bio: string
  expertise: string[]
  experienceYears: number
  portfolioUrl: string
  attachments: { name: string; url: string }[]
}

export default function InstructorApplicationPage() {
  const [formData, setFormData] = useState<ApplicationForm>({
    email: '',
    fullName: '',
    bio: '',
    expertise: [],
    experienceYears: 0,
    portfolioUrl: '',
    attachments: []
  })
  const [newExpertise, setNewExpertise] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [existingApplication, setExistingApplication] = useState<any>(null)

  const { user, isAuthenticated } = useAppSelector(state => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    // Nếu user đã đăng nhập, kiểm tra application hiện tại
    if (isAuthenticated) {
      checkExistingApplication()
    }
  }, [isAuthenticated])

  const checkExistingApplication = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/instructor/applications/me', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      
      if (data.success && data.data) {
        setExistingApplication(data.data)
      }
    } catch (error) {
      console.error('Error checking existing application:', error)
    }
  }

  const handleInputChange = (field: keyof ApplicationForm, value: any) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      }

      // Chỉ thêm Authorization header nếu user đã đăng nhập
      if (isAuthenticated) {
        const token = localStorage.getItem('token')
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
      }

      const response = await fetch('http://localhost:3000/api/instructor/applications/public', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/')
        }, 3000)
      } else {
        setError(data.message || 'Có lỗi xảy ra khi gửi đơn')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi gửi đơn. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  if (existingApplication) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">
              Đơn đăng ký của bạn
            </CardTitle>
            <CardDescription>
              Bạn đã có một đơn đăng ký giảng viên
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="mb-4">
                {existingApplication.status === 'pending' && (
                  <Badge className="bg-yellow-100 text-yellow-800">
                    Đang chờ duyệt
                  </Badge>
                )}
                {existingApplication.status === 'approved' && (
                  <Badge className="bg-green-100 text-green-800">
                    Đã được duyệt
                  </Badge>
                )}
                {existingApplication.status === 'rejected' && (
                  <Badge className="bg-red-100 text-red-800">
                    Đã bị từ chối
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Ngày nộp: {new Date(existingApplication.createdAt).toLocaleDateString('vi-VN')}
              </p>

              {existingApplication.reviewNotes && (
                <div className="p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium">Ghi chú từ admin:</p>
                  <p className="text-sm text-gray-600">{existingApplication.reviewNotes}</p>
                </div>
              )}
            </div>

            <Button 
              onClick={() => navigate('/')}
              className="w-full"
            >
              Về trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Đơn đăng ký đã được gửi!
            </CardTitle>
            <CardDescription>
              Cảm ơn bạn đã đăng ký làm giảng viên. Chúng tôi sẽ xem xét đơn của bạn và liên hệ sớm nhất.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Đăng ký làm giảng viên
          </h1>
          <p className="text-gray-600">
            Chia sẻ kiến thức và kinh nghiệm của bạn với cộng đồng học viên
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Thông tin cá nhân
            </CardTitle>
            <CardDescription>
              Vui lòng điền đầy đủ thông tin để chúng tôi có thể đánh giá hồ sơ của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Nhập email của bạn"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Họ và tên *
                  </label>
                  <Input
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Nhập họ và tên đầy đủ"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Số năm kinh nghiệm
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.experienceYears}
                    onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value) || 0)}
                    placeholder="Ví dụ: 3"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Giới thiệu bản thân *
                </label>
                <Textarea
                  value={formData.bio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('bio', e.target.value)}
                  placeholder="Giới thiệu về bản thân, kinh nghiệm giảng dạy, chuyên môn..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Chuyên môn
                </label>
                <div className="flex gap-2">
                  <Input
                    value={newExpertise}
                    onChange={(e) => setNewExpertise(e.target.value)}
                    placeholder="Thêm chuyên môn (ví dụ: Tiếng Anh giao tiếp)"
                    onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
                  />
                  <Button type="button" onClick={addExpertise} variant="outline">
                    Thêm
                  </Button>
                </div>
                {formData.expertise.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.expertise.map((expertise) => (
                      <Badge key={expertise} variant="outline" className="flex items-center gap-1">
                        {expertise}
                        <button
                          type="button"
                          onClick={() => removeExpertise(expertise)}
                          className="ml-1 hover:text-red-600"
                        >
                          <XCircle className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Portfolio/Website cá nhân
                </label>
                <div className="relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={formData.portfolioUrl}
                    onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                    placeholder="https://your-portfolio.com"
                    className="pl-10"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Đang gửi...</span>
                    </div>
                  ) : (
                    'Gửi đơn đăng ký'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
