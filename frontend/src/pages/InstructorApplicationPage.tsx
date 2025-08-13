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
  password: string
  confirmPassword: string
  fullName: string
  phone: string
  dateOfBirth: string
  bio: string
  expertise: string[]
  experienceYears: number
  education: string
  certifications: string[]
  portfolioUrl: string
  linkedinUrl: string
  teachingExperience: string
  preferredSubjects: string[]
  availability: string
  attachments: { name: string; url: string }[]
}

export default function InstructorApplicationPage() {
  const [formData, setFormData] = useState<ApplicationForm>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    dateOfBirth: '',
    bio: '',
    expertise: [],
    experienceYears: 0,
    education: '',
    certifications: [],
    portfolioUrl: '',
    linkedinUrl: '',
    teachingExperience: '',
    preferredSubjects: [],
    availability: '',
    attachments: []
  })
  const [newExpertise, setNewExpertise] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [existingApplication, setExistingApplication] = useState<any>(null)
  
  // OTP verification states
  const [showOtpForm, setShowOtpForm] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpLoading, setOtpLoading] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [otpSuccess, setOtpSuccess] = useState(false)

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
        // Lưu thông tin user để hiển thị
        setFormData(prev => ({
          ...prev,
          email: data.data.user.email
        }))
        // Hiển thị form OTP ngay lập tức
        setShowOtpForm(true)
      } else {
        setError(data.message || 'Có lỗi xảy ra khi gửi đơn')
      }
    } catch (error) {
      setError('Có lỗi xảy ra khi gửi đơn. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpLoading(true)
    setOtpError('')

    try {
      const response = await fetch('http://localhost:3000/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp
        })
      })

      const data = await response.json()

      if (data.success) {
        setOtpSuccess(true)
        setOtpError('')
        // Chuyển hướng đến trang đăng nhập sau 2 giây
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } else {
        setOtpError(data.message || 'Mã OTP không đúng')
      }
    } catch (error) {
      setOtpError('Có lỗi xảy ra khi xác thực. Vui lòng thử lại.')
    } finally {
      setOtpLoading(false)
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
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Đơn đăng ký đã được gửi thành công! 
            </CardTitle>
            <CardDescription className="text-lg">
              Tài khoản đã được tạo và email xác thực đã được gửi
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* Thông tin tài khoản */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-3"> Thông tin tài khoản:</h4>
              <div className="text-left space-y-2">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Email:</span> {formData.email}
                </p>
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Trạng thái:</span> Chờ xác thực email
                </p>
              </div>
            </div>

            {/* Form xác thực OTP */}
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-3">🔐 Xác thực tài khoản:</h4>
              
              <div className="text-left space-y-3">
                <p className="text-sm text-yellow-800">
                  Mã OTP 6 số đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập mã để xác thực.
                </p>
                
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-yellow-900">
                      Mã OTP 6 số:
                    </label>
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Nhập mã OTP 6 số"
                      maxLength={6}
                      className="text-center text-lg font-mono tracking-widest"
                      required
                    />
                    <p className="text-xs text-yellow-700">
                      Nhập chính xác 6 số từ email xác thực
                    </p>
                  </div>

                  {otpError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{otpError}</p>
                    </div>
                  )}

                  {otpSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-600">
                        ✅ Xác thực thành công! Tài khoản đã được kích hoạt.
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                    disabled={otpLoading || otpSuccess}
                  >
                    {otpLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xác thực...</span>
                      </div>
                    ) : otpSuccess ? (
                      'Đã xác thực'
                    ) : (
                      'Xác thực OTP'
                    )}
                  </Button>
                </form>
              </div>
               
              </div>

            {/* Thông báo admin */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">👨‍💼 Quy trình duyệt:</h4>
              <p className="text-sm text-gray-700">
                Sau khi xác thực email, admin sẽ xem xét đơn đăng ký và cập nhật role thành giảng viên
              </p>
            </div>

            {/* Nút điều hướng */}
            <div className="flex gap-3">
              <Button 
                onClick={() => navigate('/login')} 
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                Đi đến trang đăng nhập
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="flex-1"
              >
                Đăng ký khác
              </Button>
            </div>
          </CardContent>
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
              {/* Thông tin đăng nhập */}
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
                    Mật khẩu *
                  </label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Xác nhận mật khẩu *
                  </label>
                  <Input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Nhập lại mật khẩu"
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

              {/* Thông tin cá nhân */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Số điện thoại
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Ngày sinh
                  </label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
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

              {/* Thông tin học vấn */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Học vấn
                  </label>
                  <Input
                    value={formData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    placeholder="Ví dụ: Đại học, chuyên ngành..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Chứng chỉ
                  </label>
                  <Input
                    value={formData.certifications.join(', ')}
                    onChange={(e) => handleInputChange('certifications', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                    placeholder="Ví dụ: TESOL, CELTA, IELTS..."
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

              {/* Kinh nghiệm giảng dạy */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Kinh nghiệm giảng dạy
                </label>
                <Textarea
                  value={formData.teachingExperience}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('teachingExperience', e.target.value)}
                  placeholder="Mô tả kinh nghiệm giảng dạy, phương pháp, thành tích..."
                  rows={3}
                />
              </div>

              {/* Môn học ưa thích */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Môn học ưa thích
                </label>
                <Input
                  value={formData.preferredSubjects.join(', ')}
                  onChange={(e) => handleInputChange('preferredSubjects', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                  placeholder="Ví dụ: Tiếng Anh giao tiếp, Ngữ pháp, IELTS..."
                />
              </div>

              {/* Lịch trình */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Lịch trình giảng dạy
                </label>
                <Textarea
                  value={formData.availability}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('availability', e.target.value)}
                  placeholder="Mô tả thời gian có thể giảng dạy (sáng, chiều, tối, cuối tuần...)"
                  rows={2}
                />
              </div>

              {/* Liên kết */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Portfolio/Website cá nhân
                  </label>
                  <Input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                    placeholder="https://your-portfolio.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    LinkedIn Profile
                  </label>
                  <Input
                    value={formData.linkedinUrl}
                    onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                    placeholder="https://linkedin.com/in/your-profile"
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
