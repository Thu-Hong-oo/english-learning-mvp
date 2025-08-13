
import { useState } from "react"
import { Search, Grid, List, Calendar } from "lucide-react"

interface Article {
  id: number
  title: string
  date: string
  description: string
  image: string
}

interface ArticlesListingProps {
  onArticleClick: (article: Article) => void
}

const ArticlesListing = ({ onArticleClick }: ArticlesListingProps) => {
  const [viewMode, setViewMode] = useState("grid")

  const articles: Article[] = [
    {
      id: 1,
      title: "Best LearnPress WordPress Theme Collection For 2023",
      date: "Jan 24, 2023",
      description: "Looking for an amazing & well-functional LearnPress WordPress Theme? Online education...",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/photography-course-website-dVOj5kLTs2v1uDsOW9u2HPuzgOmQqx.png",
    },
    {
      id: 2,
      title: "Best LearnPress WordPress Theme Collection For 2023",
      date: "Jan 24, 2023",
      description: "Looking for an amazing & well-functional LearnPress WordPress Theme? Online education...",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/wordpress-theme-design-nGxKmOW6YLQMUG1qp8DqN74Sgrjmos.png",
    },
    {
      id: 3,
      title: "Best LearnPress WordPress Theme Collection For 2023",
      date: "Jan 24, 2023",
      description: "Looking for an amazing & well-functional LearnPress WordPress Theme? Online education...",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/photography-learning-course-GcCpyKFnsheTYgfivT6CRQbKYj8lWa.png",
    },
    {
      id: 4,
      title: "Best LearnPress WordPress Theme Collection For 2023",
      date: "Jan 24, 2023",
      description: "Looking for an amazing & well-functional LearnPress WordPress Theme? Online education...",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/online-student-kPaWOKBZL3R1Mt4HkOFjRVBrWQ1nc9.png",
    },
    {
      id: 5,
      title: "Best LearnPress WordPress Theme Collection For 2023",
      date: "Jan 24, 2023",
      description: "Looking for an amazing & well-functional LearnPress WordPress Theme? Online education...",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/online-course-laptop-7oCU9voEWsGxhazREVyQzKJNo7JGtr.png",
    },
    {
      id: 6,
      title: "Best LearnPress WordPress Theme Collection For 2023",
      date: "Jan 24, 2023",
      description: "Looking for an amazing & well-functional LearnPress WordPress Theme? Online education...",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/business-woman-studying-bFstkbW63yTJ8beoeJtJz7BJZaASmC.png",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
  

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="text-sm text-gray-600">
            <span>Homepage</span>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Blog</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Header with Search and View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">All Articles</h1>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search"
                    className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent w-64"
                  />
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded ${viewMode === "grid" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded ${viewMode === "list" ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-600"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => onArticleClick(article)}
                >
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-2 hover:text-orange-500">{article.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-orange-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{article.date}</span>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{article.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700">‹</button>
              <button className="px-3 py-2 bg-gray-900 text-white rounded">1</button>
              <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">2</button>
              <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">3</button>
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700">›</button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80">
            <div className="space-y-6">
              {/* Category */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Category</h3>
                <div className="space-y-2">
                  {[
                    { name: "Commercial", count: 15 },
                    { name: "Office", count: 15 },
                    { name: "Shop", count: 15 },
                    { name: "Educate", count: 15 },
                    { name: "Academy", count: 15 },
                    { name: "Single family home", count: 15 },
                  ].map((category) => (
                    <div key={category.name} className="flex justify-between items-center py-1">
                      <span className="text-gray-700 hover:text-orange-500 cursor-pointer">{category.name}</span>
                      <span className="text-gray-500 text-sm">{category.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((post) => (
                    <div key={post} className="flex gap-3">
                      <img
                        src={`/blog-post-concept.png?height=60&width=60&query=blog post ${post}`}
                        alt="Post thumbnail"
                        className="w-15 h-15 rounded object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 hover:text-orange-500 cursor-pointer line-clamp-2">
                          Best LearnPress WordPress Theme Collection For 2023
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {["Free courses", "Marketing", "Idea", "LMS", "LearnPress", "Instructor"].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-orange-100 hover:text-orange-600 cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticlesListing
