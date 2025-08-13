
import type React from "react"
import { useState } from "react"
import { ChevronDown, ChevronRight, Play, Lock, Star, Users, BookOpen, Award, Clock } from "lucide-react"

interface Lesson {
  id: string
  title: string
  duration: string
  isPreview: boolean
  isLocked?: boolean
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
  totalLessons: number
  totalDuration: string
}

interface FAQ {
  id: string
  question: string
  answer: string
}

interface Review {
  id: string
  author: string
  avatar: string
  date: string
  rating: number
  comment: string
}

interface CourseData {
  title: string
  category: string
  instructor: string
  stats: {
    duration: string
    students: number
    level: string
    lessons: number
    quizzes: number
  }
  price: {
    original: number
    current: number
  }
  description: string
  modules: Module[]
  faqs: FAQ[]
  reviews: Review[]
  rating: {
    average: number
    total: number
    breakdown: { stars: number; percentage: number }[]
  }
}

const courseData: CourseData = {
  title: "The Ultimate Guide To The Best WordPress LMS Plugin",
  category: "Photography",
  instructor: "Determined-Poitras",
  stats: {
    duration: "2Weeks",
    students: 156,
    level: "All levels",
    lessons: 20,
    quizzes: 3,
  },
  price: {
    original: 59.0,
    current: 49.0,
  },
  description:
    "LearnPress is a comprehensive WordPress LMS Plugin for WordPress. This is one of the best WordPress LMS Plugins which can be used to easily create & sell courses online.",
  modules: [
    {
      id: "1",
      title: "Lessons With Video Content",
      totalLessons: 5,
      totalDuration: "45 Mins",
      lessons: [
        { id: "1-1", title: "Lessons with video content", duration: "12:30", isPreview: true },
        { id: "1-2", title: "Lessons with video content", duration: "10:05", isPreview: true },
        { id: "1-3", title: "Lessons with video content", duration: "2:25", isPreview: false, isLocked: true },
      ],
    },
    {
      id: "2",
      title: "Lessons With Video Content",
      totalLessons: 3,
      totalDuration: "45 Mins",
      lessons: [],
    },
    {
      id: "3",
      title: "Lessons With Video Content",
      totalLessons: 5,
      totalDuration: "45 Mins",
      lessons: [],
    },
    {
      id: "4",
      title: "Lessons With Video Content",
      totalLessons: 5,
      totalDuration: "45 Mins",
      lessons: [],
    },
    {
      id: "5",
      title: "Lessons With Video Content",
      totalLessons: 5,
      totalDuration: "45 Mins",
      lessons: [],
    },
  ],
  faqs: [
    {
      id: "1",
      question: "What Does Royalty Free Mean?",
      answer:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis faucibus odio arcu duis dui, adipiscing facilisis. Urna, donec turpis egestas volutpat. Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in.",
    },
    {
      id: "2",
      question: "What Does Royalty Free Mean?",
      answer: "",
    },
    {
      id: "3",
      question: "What Does Royalty Free Mean?",
      answer: "",
    },
  ],
  reviews: [
    {
      id: "1",
      author: "Laura Hipster",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "October 03, 2022",
      rating: 5,
      comment:
        "Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel.",
    },
    {
      id: "2",
      author: "Laura Hipster",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "October 03, 2022",
      rating: 5,
      comment:
        "Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel.",
    },
    {
      id: "3",
      author: "Laura Hipster",
      avatar: "/placeholder.svg?height=40&width=40",
      date: "October 03, 2022",
      rating: 5,
      comment:
        "Quisque nec non amet quis. Varius tellus justo odio parturient mauris curabitur lorem in. Pulvinar sit ultrices mi ut eleifend luctus ut. Id sed faucibus bibendum augue id cras purus. At eget euismod cursus non. Molestie dignissim sed volutpat feugiat vel.",
    },
  ],
  rating: {
    average: 4.0,
    total: 146951,
    breakdown: [
      { stars: 5, percentage: 90 },
      { stars: 4, percentage: 5 },
      { stars: 3, percentage: 2 },
      { stars: 2, percentage: 2 },
      { stars: 1, percentage: 1 },
    ],
  },
}

export default function CoursePage() {
  const [activeTab, setActiveTab] = useState<"overview" | "curriculum" | "instructor" | "faqs" | "reviews">(
    "instructor",
  )
  const [expandedModules, setExpandedModules] = useState<string[]>(["1", "2"])
  const [expandedFAQs, setExpandedFAQs] = useState<string[]>(["1"])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
    saveInfo: false,
  })

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQs((prev) => (prev.includes(faqId) ? prev.filter((id) => id !== faqId) : [...prev, faqId]))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <span>Homepage</span>
            <span>{">"}</span>
            <span>Course</span>
            <span>{">"}</span>
            <span className="text-gray-900">The Ultimate Guide To The BestWordPress LMS Plugin</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <span className="bg-gray-700 px-3 py-1 rounded text-sm">{courseData.category}</span>
                <span className="text-gray-300 text-sm">by {courseData.instructor}</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">{courseData.title}</h1>

              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span>{courseData.stats.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-orange-500" />
                  <span>{courseData.stats.students} Students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-orange-500" />
                  <span>{courseData.stats.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-orange-500" />
                  <span>{courseData.stats.lessons} Lessons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 text-orange-500">📝</span>
                  <span>{courseData.stats.quizzes} Quizzes</span>
                </div>
              </div>
            </div>

            {/* Course Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 text-black">
                <div className="text-center mb-6">
                  <h3 className="font-semibold mb-2">Create an LMS website</h3>
                  <p className="text-sm text-gray-600 mb-4">with LearnPress plugin</p>
                  <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-blue-500 rounded-lg p-4 shadow-lg transform -rotate-12">
                        <div className="text-white text-xs font-bold">LearnPress</div>
                        <div className="bg-white rounded mt-2 p-2">
                          <div className="flex space-x-1">
                            <div className="w-4 h-2 bg-blue-300 rounded"></div>
                            <div className="w-4 h-2 bg-blue-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute top-4 right-4 w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      <div className="absolute bottom-4 right-4 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <span className="text-gray-400 line-through">${courseData.price.original}</span>
                    <span className="text-2xl font-bold text-orange-500">${courseData.price.current}</span>
                  </div>
                  <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                    Start Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="flex border-b">
                {[
                  { key: "overview", label: "Overview" },
                  { key: "curriculum", label: "Curriculum" },
                  { key: "instructor", label: "Instructor" },
                  { key: "faqs", label: "FAQs" },
                  { key: "reviews", label: "Reviews" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`px-6 py-4 font-medium transition-colors relative ${
                      activeTab === tab.key
                        ? "text-orange-500 bg-orange-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.key && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === "overview" && (
                  <div>
                    <p className="text-gray-700 leading-relaxed">{courseData.description}</p>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === "curriculum" && (
                  <div className="space-y-4">
                    <p className="text-gray-700 mb-6">{courseData.description}</p>

                    {courseData.modules.map((module) => (
                      <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            {expandedModules.includes(module.id) ? (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-gray-400" />
                            )}
                            <span className="font-medium text-gray-900">{module.title}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{module.totalLessons} Lessons</span>
                            <span>{module.totalDuration}</span>
                          </div>
                        </button>

                        {expandedModules.includes(module.id) && module.lessons.length > 0 && (
                          <div className="border-t bg-gray-50">
                            {module.lessons.map((lesson) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-white transition-colors"
                              >
                                <div className="flex items-center space-x-3">
                                  <Play className="w-4 h-4 text-gray-400" />
                                  <span
                                    className={lesson.id === "1-2" ? "text-orange-500 font-medium" : "text-gray-700"}
                                  >
                                    {lesson.title}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-3">
                                  {lesson.isPreview && (
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                                      Preview
                                    </button>
                                  )}
                                  <span className="text-sm text-gray-500 font-medium">{lesson.duration}</span>
                                  {lesson.isLocked && <Lock className="w-4 h-4 text-gray-400" />}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Instructor Tab */}
                {activeTab === "instructor" && (
                  <div>
                    <div className="flex items-start space-x-6 mb-8">
                      <div className="w-24 h-24 bg-red-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                        TT
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">ThimPress</h3>
                        <p className="text-gray-700 mb-4">
                          LearnPress is a comprehensive WordPress LMS Plugin for WordPress. This is one of the best
                          WordPress LMS Plugins which can be used to easily create & sell courses online.
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-orange-500" />
                            <span>156 Students</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <BookOpen className="w-4 h-4 text-orange-500" />
                            <span>20 Lessons</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6">
                      LearnPress is a comprehensive WordPress LMS Plugin for WordPress. This is one of the best
                      WordPress LMS Plugins which can be used to easily create & sell courses online.
                    </p>

                    <div className="flex items-center space-x-2 mb-8">
                      <span className="text-sm text-gray-600">Follow:</span>
                      <div className="flex space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-sm">
                          f
                        </div>
                        <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-sm">
                          P
                        </div>
                        <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center text-white text-sm">
                          t
                        </div>
                        <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white text-sm">
                          @
                        </div>
                        <div className="w-8 h-8 bg-blue-700 rounded flex items-center justify-center text-white text-sm">
                          in
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* FAQs Tab */}
                {activeTab === "faqs" && (
                  <div className="space-y-4">
                    {courseData.faqs.map((faq) => (
                      <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-medium text-gray-900">{faq.question}</span>
                          {expandedFAQs.includes(faq.id) ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </button>

                        {expandedFAQs.includes(faq.id) && faq.answer && (
                          <div className="border-t p-4 bg-gray-50">
                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                  <div>
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-6">Comments</h3>

                      <div className="flex items-start space-x-8 mb-8">
                        <div className="text-center">
                          <div className="text-5xl font-bold mb-2">{courseData.rating.average}</div>
                          <div className="flex justify-center mb-2">
                            {renderStars(Math.floor(courseData.rating.average))}
                          </div>
                          <div className="text-sm text-gray-600">
                            based on {courseData.rating.total.toLocaleString()} ratings
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          {courseData.rating.breakdown.map((item) => (
                            <div key={item.stars} className="flex items-center space-x-3">
                              <div className="flex">{renderStars(item.stars)}</div>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 w-8">{item.percentage}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6 mb-8">
                      {courseData.reviews.map((review) => (
                        <div key={review.id} className="flex space-x-4 pb-6 border-b border-gray-100 last:border-b-0">
                          <img
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.author}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{review.author}</h4>
                              <span className="text-sm text-gray-500">{review.date}</span>
                            </div>
                            <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>
                            <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                              Reply
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center items-center space-x-2 mb-8">
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <ChevronDown className="w-4 h-4 rotate-90" />
                      </button>
                      <button className="w-8 h-8 bg-black text-white rounded font-medium">1</button>
                      <button className="w-8 h-8 text-gray-600 hover:bg-gray-100 rounded font-medium transition-colors">
                        2
                      </button>
                      <button className="w-8 h-8 text-gray-600 hover:bg-gray-100 rounded font-medium transition-colors">
                        3
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <ChevronDown className="w-4 h-4 -rotate-90" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Comment Form - Always visible at bottom */}
            <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Leave A Comment</h3>
              <p className="text-sm text-gray-600 mb-6">
                Your email address will not be published. Required fields are marked{" "}
                <span className="text-red-500">*</span>
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name*"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email*"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                  />
                </div>

                <textarea
                  name="comment"
                  placeholder="Comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                  required
                />

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="saveInfo"
                    id="saveInfo"
                    checked={formData.saveInfo}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="saveInfo" className="text-sm text-gray-600">
                    Save my name, email in this browser for the next time I comment
                  </label>
                </div>

                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Post Comment
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar - Fixed pricing card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <span className="text-gray-400 line-through text-lg">${courseData.price.original}</span>
                  <span className="text-3xl font-bold text-orange-500">${courseData.price.current}</span>
                </div>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                  Start Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
