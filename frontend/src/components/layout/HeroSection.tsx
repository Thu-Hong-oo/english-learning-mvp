import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

export default function HeroSection() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAppSelector(state => state.auth);

  const handleExploreCourses = () => {
    navigate('/course-listing');
  };

  const handleInstructorApplication = () => {
    navigate('/instructor-application');
  };

  const handleTeacherDashboard = () => {
    navigate('/teacher');
  };

  const handleAdminDashboard = () => {
    navigate('/admin');
  };

  return (
    <section className="bg-gradient-to-r from-yellow-100 via-green-100 to-blue-100 ">
      <div className="container mx-auto px-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Nâng cao kỹ năng với<br />
              Khóa học trực tuyến
            </h1>
            <p className="text-gray-600 text-lg max-w-md">
              Học tập hiệu quả với các khóa học được thiết kế bài bản, dễ hiểu và thực tế.
            </p>
            <div className="flex gap-4">
              <Button 
                onClick={handleExploreCourses}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full"
              >
                Khám phá khóa học
              </Button>
              
              {/* Hiển thị nút phù hợp với role */}
              {isAuthenticated && user ? (
                user.role === 'teacher' ? (
                  <Button 
                    onClick={handleTeacherDashboard}
                    variant="outline"
                    className="border-green-300 text-green-600 hover:bg-green-50 px-8 py-3 rounded-full"
                  >
                    Teacher Dashboard
                  </Button>
                ) : user.role === 'admin' ? (
                  <Button 
                    onClick={handleAdminDashboard}
                    variant="outline"
                    className="border-purple-300 text-purple-600 hover:bg-purple-50 px-8 py-3 rounded-full"
                  >
                    Admin Dashboard
                  </Button>
                ) : (
                  <Button 
                    onClick={handleInstructorApplication}
                    variant="outline"
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full"
                  >
                    Đăng ký làm giảng viên
                  </Button>
                )
              ) : (
                <Button 
                  onClick={handleInstructorApplication}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-full"
                >
                  Đăng ký làm giảng viên
                </Button>
              )}
            </div>
          </div>
          <div className="relative">
            <img
              src="./hero-student.png"
              alt="Học viên đang học"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
