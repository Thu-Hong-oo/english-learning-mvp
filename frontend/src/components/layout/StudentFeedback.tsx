import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'

const feedbacks = [
  {
    id: 1,
    text: "I must explain to you how all this mistaken . Tdea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound",
    author: "Roe Smith",
    role: "Designer",
    avatar: "/professional-woman-avatar.png"
  },
  {
    id: 2,
    text: "I must explain to you how all this mistaken . Tdea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound",
    author: "Roe Smith",
    role: "Designer",
    avatar: "/professional-man-avatar.png"
  },
  {
    id: 3,
    text: "I must explain to you how all this mistaken . Tdea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound",
    author: "Roe Smith",
    role: "Designer",
    avatar: "/professional-woman-avatar-2.png"
  },
  {
    id: 4,
    text: "I must explain to you how all this mistaken . Tdea of denouncing pleasure and praising pain was born and I will give you a complete account of the system and expound",
    author: "Roe Smith",
    role: "Designer",
    avatar: "/professional-man-avatar-2.png"
  }
]

export default function StudentFeedback() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Student Feedbacks</h2>
          <p className="text-gray-600">What Students Say About Academy LMS</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {feedbacks.map((feedback) => (
            <Card key={feedback.id} className="h-full">
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                  {feedback.text}
                </p>
                <div className="flex items-center space-x-3">
                  <img
                    src={feedback.avatar || "/placeholder.svg"}
                    alt={feedback.author}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{feedback.author}</div>
                    <div className="text-sm text-gray-500">{feedback.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
