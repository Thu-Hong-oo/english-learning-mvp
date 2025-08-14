import { Button } from '@/components/ui/button'
import { Palette, Code, MessageCircle, Video, Camera, TrendingUp, FileText, DollarSign, Atom, Network } from 'lucide-react'

const categories = [
  { name: 'Art & Design', courses: 38, icon: Palette, color: 'text-orange-500' },
  { name: 'Development', courses: 38, icon: Code, color: 'text-orange-500' },
  { name: 'Communication', courses: 38, icon: MessageCircle, color: 'text-orange-500' },
  { name: 'Videography', courses: 38, icon: Video, color: 'text-orange-500' },
  { name: 'Photography', courses: 38, icon: Camera, color: 'text-orange-500' },
  { name: 'Marketing', courses: 38, icon: TrendingUp, color: 'text-orange-500' },
  { name: 'Content Writing', courses: 38, icon: FileText, color: 'text-orange-500' },
  { name: 'Finance', courses: 38, icon: DollarSign, color: 'text-orange-500' },
  { name: 'Science', courses: 38, icon: Atom, color: 'text-orange-500' },
  { name: 'Network', courses: 38, icon: Network, color: 'text-orange-500' },
]

export default function TopCategories() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-20">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Danh mục hàng đầu</h2>
            <p className="text-gray-600">Khám phá các danh mục phổ biến</p>
          </div>
          <Button variant="outline" className="rounded-full">
            Tất cả danh mục
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <div key={index} className="text-center group cursor-pointer border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-50 rounded-full flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                  <IconComponent className={`w-8 h-8 ${category.color}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.courses} khóa học</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
