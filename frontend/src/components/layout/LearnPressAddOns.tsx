import { Button } from '@/components/ui/button'

export default function LearnPressAddOns() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-green-100 via-purple-100 to-pink-100 rounded-3xl p-12 relative overflow-hidden">
          <div className="max-w-md">
            <p className="text-sm text-gray-600 mb-2">GET MORE POWER FROM</p>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">LearnPress Add-Ons</h2>
            <p className="text-gray-600 mb-6">
              The next level of LearnPress - LMS WordPress Plugin. More 
              Powerful, Flexible and Magical Inside.
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-8">
              Explore Course
            </Button>
          </div>
          
          {/* Floating Icons */}
          <div className="absolute right-20 top-10 w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center transform rotate-12">
            <span className="text-white font-bold">?</span>
          </div>
          <div className="absolute right-40 top-20 w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center transform -rotate-12">
            <span className="text-white text-xs">30%</span>
          </div>
          <div className="absolute right-10 top-32 w-14 h-14 bg-cyan-400 rounded-2xl flex items-center justify-center">
            <span className="text-white font-bold">H5P</span>
          </div>
          <div className="absolute right-32 bottom-20 w-12 h-12 bg-green-500 rounded-xl"></div>
          <div className="absolute right-60 bottom-10 w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-white">WOO</span>
          </div>
          <div className="absolute right-16 bottom-32 w-10 h-10 bg-red-500 rounded-lg"></div>
          <div className="absolute right-48 top-40 w-8 h-8 bg-orange-400 rounded-full"></div>
        </div>
      </div>
    </section>
  )
}
