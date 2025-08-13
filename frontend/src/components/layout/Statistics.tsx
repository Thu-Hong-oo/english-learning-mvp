const stats = [
    { number: '25K+', label: 'Học viên đang hoạt động', color: 'text-orange-500' },
    { number: '899', label: 'Tổng số khóa học', color: 'text-orange-500' },
    { number: '158', label: 'Giảng viên', color: 'text-orange-500' },
    { number: '100%', label: 'Mức độ hài lòng', color: 'text-orange-500' },
  ]
  
  export default function Statistics() {
    return (
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  