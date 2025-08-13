import React from 'react'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { useNavigate } from 'react-router-dom'
const articles = [
    {
        id: 1,
        title: 'Best LearnPress WordPress Theme Collection For 2023',
        date: 'Jan 24, 2023',
        excerpt: 'Looking for an amazing & well-functional LearnPress WordPress Theme?...',
        image: '/Rectangle139.png'
    },
    {
        id: 2,
        title: 'Best LearnPress WordPress Theme Collection For 2023',
        date: 'Jan 24, 2023',
        excerpt: 'Looking for an amazing & well-functional LearnPress WordPress Theme?...',
        image: '/Rectangle139.png'
    },
    {
        id: 3,
        title: 'Best LearnPress WordPress Theme Collection For 2023',
        date: 'Jan 24, 2023',
        excerpt: 'Looking for an amazing & well-functional LearnPress WordPress Theme?...',
        image: '/Rectangle139.png'
    }
]
const LatestArtical = () => {
    const navigate = useNavigate()
    return (
        <section className="py-20">
            <div className="container mx-auto px-20">
                <div className="flex justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-2">Bài viết mới nhất</h2>
                        <p className="text-gray-600 mb-4">Khám phá các bài viết miễn phí</p>
                    </div>
                    <Button variant="outline" className="rounded-full" onClick={() => navigate('/blog')}>
                        Tất cả bài viết
                    </Button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {articles.map((article) => (
                        <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">


                            <CardContent className="p-6">
                                <img src={article.image} alt="" />
                                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">
                                    {article.title}
                                </h3>
                                <div className="flex items-center space-x-2 text-sm text-orange-500 mb-3">
                                    <span>{article.date}</span>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    {article.excerpt}
                                </p>
                            </CardContent>
                        </Card>
                    ))}

                </div>
            </div>
        </section>
    );
};


export default LatestArtical;
