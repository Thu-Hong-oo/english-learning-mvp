import { Button } from '../ui/button'
import { Card, CardContent, } from '../ui/card'
import { Clock, Users, Star } from 'lucide-react'


const courses = [
  {
    id: 1,
    title: 'Create An LMS Website With LearnPress',
    instructor: 'Determined-Poitras',
    category: 'Photography',
    weeks: 2,
    students: 156,
    price: 'Free',
    originalPrice: '$29.0',
    image: '/placeholder-drznq.png'
  },
  {
    id: 2,
    title: 'Design A Website With ThimPress',
    instructor: 'Determined-Poitras',
    category: 'Photography',
    weeks: 2,
    students: 156,
    price: '$49.0',
    originalPrice: '$59.0',
    image: '/website-design-course.png'
  },
  {
    id: 3,
    title: 'Create An LMS Website With LearnPress',
    instructor: 'Determined-Poitras',
    category: 'Photography',
    weeks: 2,
    students: 156,
    price: 'Free',
    originalPrice: '$29.0',
    image: '/online-learning-platform.png'
  },
  {
    id: 4,
    title: 'Create An LMS Website With LearnPress',
    instructor: 'Determined-Poitras',
    category: 'Photography',
    weeks: 2,
    students: 156,
    price: 'Free',
    originalPrice: '$29.0',
    image: '/photography-course.png'
  },
  {
    id: 5,
    title: 'Create An LMS Website With LearnPress',
    instructor: 'Determined-Poitras',
    category: 'Photography',
    weeks: 2,
    students: 156,
    price: 'Free',
    originalPrice: '$29.0',
    image: '/web-development-course.png'
  },
  {
    id: 6,
    title: 'Create An LMS Website With LearnPress',
    instructor: 'Determined-Poitras',
    category: 'Photography',
    weeks: 2,
    students: 156,
    price: 'Free',
    originalPrice: '$29.0',
    image: '/online-education-course.png'
  }
]

export default function FeaturedCourses() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-20">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Courses</h2>
            <p className="text-gray-600">Explore our Popular Courses</p>
          </div>
          <Button variant="outline" className="rounded-full">
            All Courses
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gray-900 text-white px-3 py-1 rounded text-sm">
                    {course.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-6">
                <div className="mb-2">
                  <span className="text-sm text-gray-500">by {course.instructor}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-4 line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.weeks}Weeks</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{course.students} Students</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-orange-500">{course.price}</span>
                    {course.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">{course.originalPrice}</span>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    View More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
