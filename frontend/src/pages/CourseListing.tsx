"use client"

import { useState, type ReactNode } from "react"
import { Search, Grid, List, Star, ChevronLeft, ChevronRight } from "lucide-react"

type Course = {
  id: number
  title: string
  instructor: string
  category: string
  image: string
  duration: string
  students: number
  level: string
  lessons: number
  price: string
  type: string
}

type FilterItem = {
  id: string
  name: string
  count: number
}

const CourseCard = ({ course }: { course: Course }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
    <div className="relative">
      <img src={course.image || "/placeholder.svg"} alt={course.title} className="w-full h-48 object-cover" />
      <span className="absolute top-3 left-3 bg-gray-800 text-white px-2 py-1 rounded text-sm">{course.category}</span>
    </div>
    <div className="p-4">
      <p className="text-sm text-gray-600 mb-2">by {course.instructor}</p>
      <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{course.title}</h3>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
          {course.duration}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          {course.students} Students
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          {course.level}
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          {course.lessons} Lessons
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">${course.price}</span>
          <span className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">{course.type}</span>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">View More</button>
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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([])
  const [selectedPrices, setSelectedPrices] = useState<string[]>([])
  const [selectedLevels, setSelectedLevels] = useState<string[]>([])

  const courses: Course[] = [
    {
      id: 1,
      title: "Create An LMS Website With LearnPress",
      instructor: "Determined Polkars",
      category: "Photography",
      image: "/photography-course-website.png",
      duration: "2Weeks",
      students: 156,
      level: "All levels",
      lessons: 20,
      price: "29.0",
      type: "Free",
    },
    {
      id: 2,
      title: "Create An LMS Website With LearnPress",
      instructor: "Determined Polkars",
      category: "Photography",
      image: "/wordpress-theme-design.png",
      duration: "2Weeks",
      students: 156,
      level: "All levels",
      lessons: 20,
      price: "29.0",
      type: "Free",
    },
    {
      id: 3,
      title: "Create An LMS Website With LearnPress",
      instructor: "Determined Polkars",
      category: "Photography",
      image: "/photography-learning-course.png",
      duration: "2Weeks",
      students: 156,
      level: "All levels",
      lessons: 20,
      price: "29.0",
      type: "Free",
    },
    {
      id: 4,
      title: "Create An LMS Website With LearnPress",
      instructor: "Determined Polkars",
      category: "Photography",
      image: "/online-student.png",
      duration: "2Weeks",
      students: 156,
      level: "All levels",
      lessons: 20,
      price: "29.0",
      type: "Free",
    },
    {
      id: 5,
      title: "Create An LMS Website With LearnPress",
      instructor: "Determined Polkars",
      category: "Photography",
      image: "/online-course-laptop.png",
      duration: "2Weeks",
      students: 156,
      level: "All levels",
      lessons: 20,
      price: "29.0",
      type: "Free",
    },
    {
      id: 6,
      title: "Create An LMS Website With LearnPress",
      instructor: "Determined Polkars",
      category: "Photography",
      image: "/business-woman-studying.png",
      duration: "2Weeks",
      students: 156,
      level: "All levels",
      lessons: 20,
      price: "29.0",
      type: "Free",
    },
  ]

  const categories: FilterItem[] = [
    { id: "commercial", name: "Commercial", count: 15 },
    { id: "office", name: "Office", count: 15 },
    { id: "shop", name: "Shop", count: 15 },
    { id: "educate", name: "Educate", count: 15 },
    { id: "academy", name: "Academy", count: 15 },
    { id: "family", name: "Single family home", count: 15 },
    { id: "studio", name: "Studio", count: 15 },
    { id: "university", name: "University", count: 15 },
  ]

  const instructors: FilterItem[] = [
    { id: "kenny", name: "Kenny White", count: 15 },
    { id: "john", name: "John Doe", count: 15 },
  ]

  const priceOptions: FilterItem[] = [
    { id: "all", name: "All", count: 15 },
    { id: "free", name: "Free", count: 15 },
    { id: "paid", name: "Paid", count: 15 },
  ]

  const levelOptions: FilterItem[] = [
    { id: "all", name: "All levels", count: 15 },
    { id: "beginner", name: "Beginner", count: 15 },
    { id: "intermediate", name: "Intermediate", count: 15 },
    { id: "expert", name: "Expert", count: 15 },
  ]

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <span>Homepage</span>
            <span className="mx-2">›</span>
            <span>Course</span>
            <span className="mx-2">›</span>
            <span className="text-gray-900">The Ultimate Guide To The Best WordPress LMS Plugin</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">All Courses</h1>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search"
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2">
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-lg bg-gray-900 text-white font-medium">1</button>
              <button className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium">2</button>
              <button className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium">3</button>
              <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-white rounded-lg p-6 h-fit">
            <FilterSection title="Course Category">
              <CheckboxFilter items={categories} selectedItems={selectedCategories} onChange={handleCategoryChange} />
            </FilterSection>

            <FilterSection title="Instructors">
              <CheckboxFilter
                items={instructors}
                selectedItems={selectedInstructors}
                onChange={handleInstructorChange}
              />
            </FilterSection>

            <FilterSection title="Price">
              <CheckboxFilter items={priceOptions} selectedItems={selectedPrices} onChange={handlePriceChange} />
            </FilterSection>

            <FilterSection title="Review">
              <div className="space-y-2">
                <StarRating rating={5} count="1,025" />
                <StarRating rating={4} count="1,025" />
                <StarRating rating={3} count="1,025" />
                <StarRating rating={2} count="1,025" />
                <StarRating rating={1} count="1,025" />
              </div>
            </FilterSection>

            <FilterSection title="Level">
              <CheckboxFilter items={levelOptions} selectedItems={selectedLevels} onChange={handleLevelChange} />
            </FilterSection>
          </div>
        </div>
      </div>
    </div>
  )
}
