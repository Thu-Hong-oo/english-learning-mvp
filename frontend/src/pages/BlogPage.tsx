"use client"

import { useState } from "react"
import ArticlesListing from "../components/layout/article-listing"
import BlogPost from "../components/layout/Blog-post"

interface Article {
  id: number
  title: string
  date: string
  description: string
  image: string
}

const BlogApp = () => {
  const [currentView, setCurrentView] = useState<"listing" | "detail">("listing")
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article)
    setCurrentView("detail")
  }

  const handleBackToListing = () => {
    setCurrentView("listing")
    setSelectedArticle(null)
  }

  if (currentView === "detail" && selectedArticle) {
    return <BlogPost article={selectedArticle} onBack={handleBackToListing} />
  }

  return <ArticlesListing onArticleClick={handleArticleClick} />
}

export default BlogApp
