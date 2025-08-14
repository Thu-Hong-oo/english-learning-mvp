import { useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, } from '../ui/card'
import { Clock, Users, Star } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { fetchFeaturedCourses } from '../../store/slices/courseSlice'
import { useNavigate } from 'react-router-dom'

// Helper function to format price
const formatPrice = (price: number): string => {
  if (price === 0) return 'Miễn phí';
  return `$${price.toFixed(2)}`;
};

// Helper function to format duration
const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
  }
  return `${mins}m`;
};

export default function FeaturedCourses() {
  const dispatch = useAppDispatch();
  const { featuredCourses, loading, error } = useAppSelector((state) => state.courses);
  const navigate = useNavigate()
  
  // Debug: Log the state
  console.log('FeaturedCourses state:', { featuredCourses, loading, error });
  
  // Fetch featured courses when component mounts
  useEffect(() => {
    dispatch(fetchFeaturedCourses());
  }, [dispatch]);

  // Show loading state
  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải khóa học...</p>
          </div>
        </div>
      </section>
    );
  }

  // Show error state
  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-20">
          <div className="text-center text-red-600">
            <p>Lỗi tải khóa học: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-20">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Khóa học nổi bật</h2>
            <p className="text-gray-600">Khám phá các khóa học phổ biến</p>
          </div>
          <Button variant="outline" className="rounded-full" onClick={() => navigate('/course-listing')}>
            Tất cả khóa học
          </Button>
        </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {Array.isArray(featuredCourses) && featuredCourses.length > 0 ? (
                   featuredCourses.map((course) => (
                   <Card key={course._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                     <div className="relative">
                       <img
                         src={course.thumbnail || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'}
                         alt={course.title}
                         className="w-full h-48 object-cover"
                       />
                       <div className="absolute top-4 left-4">
                         <span className="bg-gray-900 text-white px-3 py-1 rounded text-sm">
                           {course.category}
                         </span>
                       </div>
                     </div>
                     <CardContent className="p-6">
                       <div className="mb-2">
                          <span className="text-sm text-gray-500">Trình độ: {course.level}</span>
                       </div>
                       <h3 className="font-semibold text-gray-900 mb-4 line-clamp-2">
                         {course.title}
                       </h3>
                       <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                         {course.description}
                       </p>
                       <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                         <div className="flex items-center space-x-1">
                           <Clock className="w-4 h-4" />
                            <span>{course.lessonsCount} bài học</span>
                         </div>
                         <div className="flex items-center space-x-1">
                           <Users className="w-4 h-4" />
                            <span>{course.totalStudents} học viên</span>
                         </div>
                         <div className="flex items-center space-x-1">
                           <Star className="w-4 h-4 text-yellow-500" />
                           <span>{course.rating.toFixed(1)}</span>
                         </div>
                       </div>
                       <div className="flex justify-between items-center">
                         <div className="flex items-center space-x-2">
                           <span className="text-lg font-bold text-orange-500">{formatPrice(course.price)}</span>
                         </div>
                          <Button variant="outline" size="sm">
                            Xem thêm
                         </Button>
                       </div>
                     </CardContent>
                   </Card>
                 ))
                 ) : (
                   <div className="col-span-full text-center py-12">
                     <p className="text-gray-500 text-lg">Chưa có khóa học nào</p>
                     <p className="text-gray-400 text-sm mt-2">Hãy quay lại sau khi có khóa học mới</p>
                   </div>
                 )}
               </div>
      </div>
    </section>
  )
}
