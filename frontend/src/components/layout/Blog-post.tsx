"use client"

import { Calendar, User, MessageCircle, Facebook, Twitter, Linkedin, Mail, ArrowLeft } from "lucide-react"

interface Article {
  id: number
  title: string
  date: string
  description: string
  image: string
}

interface BlogPostProps {
  article: Article
  onBack: () => void
}

const BlogPost = ({ article, onBack }: BlogPostProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <nav className="text-sm text-gray-600">
              <button onClick={onBack} className="hover:text-orange-500">
                Homepage
              </button>
              <span className="mx-2">›</span>
              <button onClick={onBack} className="hover:text-orange-500">
                Blog
              </button>
              <span className="mx-2">›</span>
              <span className="text-gray-900">{article.title}</span>
            </nav>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Articles
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <article className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Article Header */}
              <div className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>

                <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Determinated Polkars</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>15 Comments</span>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="mb-8">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Article Content */}
                <div className="prose max-w-none mb-8">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilisis facilibus vitae quis diam
                    elit, adipiscing facilibus. Lrem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilibus
                    facilibus vitae quis diam elit, adipiscing facilibus. Lrem ipsum dolor sit amet, consectetur
                    adipiscing elit. Cras facilibus facilibus vitae quis diam elit, adipiscing facilibus. Lrem ipsum
                    dolor sit amet, consectetur adipiscing elit. Cras facilibus facilibus vitae quis diam elit,
                    adipiscing facilibus. Mauris dignissim sed vulputate feugiat sit vitae eu magna imperdiet.
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilibus facilibus vitae quis diam
                    elit, adipiscing facilibus. Lrem ipsum dolor sit amet, consectetur adipiscing elit. Cras facilibus
                    facilibus vitae quis diam elit, adipiscing facilibus. Lrem ipsum dolor sit amet, consectetur
                    adipiscing elit. Cras facilibus facilibus vitae quis diam elit, adipiscing facilibus. Mauris
                    dignissim sed vulputate feugiat sit vitae eu magna imperdiet.
                  </p>
                </div>

                {/* Tags */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-medium text-gray-900">Tags:</span>
                  <div className="flex gap-2">
                    {["Free courses", "Marketing", "Idea", "LMS", "LearnPress", "Instructor"].map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Share */}
                <div className="flex items-center gap-4 pb-6 border-b">
                  <span className="text-sm font-medium text-gray-900">Share:</span>
                  <div className="flex gap-2">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                      <Facebook className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-blue-400 hover:bg-blue-50 rounded">
                      <Twitter className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-blue-700 hover:bg-blue-50 rounded">
                      <Linkedin className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-600 hover:bg-gray-50 rounded">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Post Navigation */}
              <div className="px-8 py-6 bg-gray-50 border-t flex justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Previous</span>
                  <span className="text-sm font-medium text-gray-900">
                    Best LearnPress WordPress Theme Collection For 2023
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">
                    Best LearnPress WordPress Theme Collection For 2023
                  </span>
                  <span className="text-sm text-gray-600">Next</span>
                </div>
              </div>

              {/* Comments Section */}
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Comments</h3>
                <p className="text-sm text-gray-600 mb-6">20 Comments</p>

                {/* Comments List */}
                <div className="space-y-6 mb-8">
                  {[1, 2, 3].map((comment) => (
                    <div key={comment} className="flex gap-4">
                      <img
                        src={`/user-avatar.png?height=40&width=40&query=user avatar ${comment}`}
                        alt="User avatar"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-medium text-gray-900">Laura Master</span>
                          <span className="text-sm text-gray-500">October 05, 2023</span>
                        </div>
                        <p className="text-gray-700 text-sm mb-3">
                          Quisque non enim quis. Morbi tellus justo vehicula pretium mauris molestie lorem. In
                          Pellentesque sit ultrices, sit ut molestie lorem. Ut vel faucibus bibendum magna sit vitae
                          purus. At eget suscipit cursus non. Molestie dignissim sed vulputate feugiat sit.
                        </p>
                        <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">Reply</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mb-8">
                  <button className="w-8 h-8 rounded-full bg-gray-900 text-white text-sm">1</button>
                  <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 text-sm hover:bg-gray-300">
                    2
                  </button>
                  <button className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 text-sm hover:bg-gray-300">
                    3
                  </button>
                  <span className="w-8 h-8 flex items-center justify-center text-gray-500">...</span>
                </div>

                {/* Comment Form */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Leave A Comment</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Your email address will not be published. Required fields are marked *
                  </p>

                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Name*"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <input
                        type="email"
                        placeholder="Email*"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <textarea
                      placeholder="Comment"
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    ></textarea>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="save-info" className="rounded" />
                      <label htmlFor="save-info" className="text-sm text-gray-600">
                        Save my name, email in this browser for the next time I comment
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium"
                    >
                      Post Comment
                    </button>
                  </form>
                </div>
              </div>
            </article>
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

export default BlogPost
