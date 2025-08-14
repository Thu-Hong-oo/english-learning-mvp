"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Search, Grid, List, Star, ChevronLeft, ChevronRight, Play, Eye, Clock, Users, BookOpen, DollarSign } from "lucide-react"
import { useNavigate } from "react-router-dom"

type Course = {
  _id: string
  title: string
  description: string
  level: 'beginner' | 'intermediate' | 'advanced'
  category: string
  thumbnail?: string
  duration: number
  lessonsCount: number
  totalStudents: number
  price: number
  rating: number
  teacher: {
    _id: string
    fullName: string
    avatar?: string
  }
  status: string
  adminApproval: string
  tags: string[]
  requirements: string[]
  objectives: string[]
}

type FilterItem = {
  id: string
  name: string
  count: number
}

const CourseCard = ({ course, onViewDetails, onStartLearning }: { 
  course: Course
  onViewDetails: (course: Course) => void
  onStartLearning: (course: Course) => void
}) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
    <div className="relative">
      <img 
        src={course.thumbnail || "/placeholder.svg"} 
        alt={course.title} 
        className="w-full h-48 object-cover"
        onError={(e) => {
          e.currentTarget.src = "/placeholder.svg"
        }}
      />
      <span className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-sm font-medium">
        {course.category}
      </span>
      {course.status === 'published' && course.adminApproval === 'approved' && (
        <span className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
          Active
        </span>
      )}
    </div>
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        {course.teacher?.avatar ? (
          <img 
            src={course.teacher.avatar} 
            alt={course.teacher.fullName || 'Unknown Teacher'}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600">
            {course.teacher?.fullName?.charAt(0) || '?'}
          </div>
        )}
        <p className="text-sm text-gray-600">by {course.teacher?.fullName || 'Unknown Teacher'}</p>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">{course.title}</h3>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2 h-10">{course.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3 text-orange-500" />
          <span>{course.duration}h</span>
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3 text-blue-500" />
          <span>{course.totalStudents}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${
            course.level === 'beginner' ? 'bg-green-500' : 
            course.level === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></span>
          <span className="capitalize">{course.level}</span>
        </span>
        <span className="flex items-center gap-1">
          <BookOpen className="w-3 h-3 text-purple-500" />
          <span>{course.lessonsCount}</span>
        </span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {course.price === 0 ? (
            <span className="text-lg font-bold text-green-600">Free</span>
          ) : (
            <>
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span className="text-lg font-bold text-gray-900">${course.price}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm text-gray-600">{course.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => onViewDetails(course)}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Eye className="w-4 h-4" />
          Xem chi tiết
        </button>
        <button 
          onClick={() => onStartLearning(course)}
          className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Play className="w-4 h-4" />
          Vào học
        </button>
      </div>
    </div>
  </div>
)

const FilterSection = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="mb-6">
    <h3 className="font-semibold text-gray-900 mb-3">{title}</h3>
    {children}
  </div>
)

const CheckboxFilter = ({ items, selectedItems, onChange }: { items: FilterItem[]; selectedItems: string[]; onChange: (id: string) => void }) => (
  <div className="space-y-2">
    {items.map((item) => (
      <label key={item.id} className="flex items-center justify-between cursor-pointer">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => onChange(item.id)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{item.name}</span>
        </div>
        <span className="text-sm text-gray-500">{item.count}</span>
      </label>
    ))}
  </div>
)

const StarRating = ({ rating, count }: { rating: number; count: string | number }) => (
  <label className="flex items-center justify-between cursor-pointer">
    <div className="flex items-center gap-2">
      <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded" />
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    </div>
    <span className="text-sm text-gray-500">({count})</span>
  </label>
)

export default function CourseListing() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([])
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<FilterItem[]>([])
  const [instructors, setInstructors] = useState<FilterItem[]>([])

  // Fetch courses from API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:3000/api/courses')
        const data = await response.json()
        
        console.log('🔍 API Response:', data)
        console.log('🔍 Data structure:', typeof data, data)
        console.log('🔍 Data.data:', data.data)
        console.log('🔍 Is Array?', Array.isArray(data.data))
        
        if (data.success) {
          // API trả về data.data.items thay vì data.data
          const coursesArray = data.data?.items || data.data
          
          // Kiểm tra xem có phải là array không
          if (!Array.isArray(coursesArray)) {
            console.error('❌ coursesArray is not an array:', coursesArray)
            setError('Invalid data format from server')
            return
          }
          
          const publishedCourses = coursesArray.filter((course: Course) => 
            course.status === 'published' && course.adminApproval === 'approved'
          )
          
          console.log('✅ Published courses:', publishedCourses)
          
          // Debug: xem cấu trúc của course đầu tiên
          if (publishedCourses.length > 0) {
            console.log('🔍 First course structure:', publishedCourses[0])
            console.log('🔍 First course teacher:', publishedCourses[0].teacher)
          }
          
          setCourses(publishedCourses)
          setFilteredCourses(publishedCourses)
          
          // Generate categories and instructors from actual data
          const categoryCounts: { [key: string]: number } = {}
          const instructorCounts: { [key: string]: number } = {}
          
          publishedCourses.forEach((course: Course) => {
            // Kiểm tra an toàn cho category
            if (course.category) {
              categoryCounts[course.category] = (categoryCounts[course.category] || 0) + 1
            }
            
            // Kiểm tra an toàn cho teacher
            if (course.teacher && course.teacher.fullName) {
              instructorCounts[course.teacher.fullName] = (instructorCounts[course.teacher.fullName] || 0) + 1
            }
          })
          
          setCategories(Object.entries(categoryCounts).map(([name, count]) => ({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            count
          })))
          
          setInstructors(Object.entries(instructorCounts).map(([name, count]) => ({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            count
          })))
        } else {
          console.error('❌ API not successful:', data)
          setError(data.message || 'Failed to fetch courses')
        }
      } catch (error) {
        console.error('❌ Error fetching courses:', error)
        setError('Failed to fetch courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // Filter courses based on selected filters
  useEffect(() => {
    let filtered = courses

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (course.teacher?.fullName && course.teacher.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(course =>
        course.category && selectedCategories.some(cat => 
          course.category.toLowerCase().includes(cat.replace(/-/g, ' '))
        )
      )
    }

    // Instructor filter
    if (selectedInstructors.length > 0) {
      filtered = filtered.filter(course =>
        course.teacher?.fullName && selectedInstructors.some(instructor => 
          course.teacher.fullName.toLowerCase().includes(instructor.replace(/-/g, ' '))
        )
      )
    }

    // Price filter
    if (selectedPrices.length > 0) {
      filtered = filtered.filter(course => {
        if (selectedPrices.includes('free')) return course.price === 0
        if (selectedPrices.includes('paid')) return course.price > 0
        return true
      })
    }

    // Level filter
    if (selectedLevels.length > 0) {
      filtered = filtered.filter(course =>
        selectedLevels.includes(course.level)
      )
    }

    setFilteredCourses(filtered)
  }, [courses, searchTerm, selectedCategories, selectedInstructors, selectedPrices, selectedLevels])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
    )
  }

  const handleInstructorChange = (instructorId: string) => {
    setSelectedInstructors((prev) =>
      prev.includes(instructorId) ? prev.filter((id) => id !== instructorId) : [...prev, instructorId],
    )
  }

  const handlePriceChange = (priceId: string) => {
    setSelectedPrices((prev) => (prev.includes(priceId) ? prev.filter((id) => id !== priceId) : [...prev, priceId]))
  }

  const handleLevelChange = (levelId: string) => {
    setSelectedLevels((prev) => (prev.includes(levelId) ? prev.filter((id) => id !== levelId) : [...prev, levelId]))
  }

  const handleViewDetails = (course: Course) => {
    navigate(`/courses/${course._id}`)
  }

  const handleStartLearning = (course: Course) => {
    navigate(`/courses/${course._id}/learn`)
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedInstructors([])
    setSelectedPrices([])
    setSelectedLevels([])
    setSearchTerm("")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải khóa học...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Lỗi tải dữ liệu</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  const priceOptions: FilterItem[] = [
    { id: "all", name: "Tất cả", count: filteredCourses.length },
    { id: "free", name: "Miễn phí", count: filteredCourses.filter(c => c.price === 0).length },
    { id: "paid", name: "Trả phí", count: filteredCourses.filter(c => c.price > 0).length },
  ]

  const levelOptions: FilterItem[] = [
    { id: "all", name: "Tất cả cấp độ", count: filteredCourses.length },
    { id: "beginner", name: "Người mới bắt đầu", count: filteredCourses.filter(c => c.level === 'beginner').length },
    { id: "intermediate", name: "Trung cấp", count: filteredCourses.filter(c => c.level === 'intermediate').length },
    { id: "advanced", name: "Nâng cao", count: filteredCourses.filter(c => c.level === 'advanced').length },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <span>Trang chủ</span>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Tất cả khóa học</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tất cả khóa học</h1>
                <p className="text-gray-600 mt-1">Tìm thấy {filteredCourses.length} khóa học</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm khóa học..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Grid className="w-4 h-4" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Course Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {filteredCourses.map((course) => (
                  <CourseCard 
                    key={course._id} 
                    course={course}
                    onViewDetails={handleViewDetails}
                    onStartLearning={handleStartLearning}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <BookOpen className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy khóa học</h3>
                <p className="text-gray-600 mb-4">Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                <button 
                  onClick={clearAllFilters}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-white rounded-lg p-6 h-fit">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
              <button 
                onClick={clearAllFilters}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Xóa tất cả
              </button>
            </div>

            <FilterSection title="Danh mục khóa học">
              <CheckboxFilter items={categories} selectedItems={selectedCategories} onChange={handleCategoryChange} />
            </FilterSection>

            <FilterSection title="Giảng viên">
              <CheckboxFilter
                items={instructors}
                selectedItems={selectedInstructors}
                onChange={handleInstructorChange}
              />
            </FilterSection>

            <FilterSection title="Giá">
              <CheckboxFilter items={priceOptions} selectedItems={selectedPrices} onChange={handlePriceChange} />
            </FilterSection>

            <FilterSection title="Cấp độ">
              <CheckboxFilter items={levelOptions} selectedItems={selectedLevels} onChange={handleLevelChange} />
            </FilterSection>
          </div>
        </div>
      </div>
    </div>
  )
}
