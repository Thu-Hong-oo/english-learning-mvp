import {Button }from '../ui/button';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-yellow-100 via-green-100 to-blue-100 ">
      <div className="container mx-auto px-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-3">
            <h1 className="text-5xl font-bold text-gray-900 leading-tight">
              Nâng cao kỹ năng với<br />
              Khóa học trực tuyến
            </h1>
            <p className="text-gray-600 text-lg max-w-md">
              Học tập hiệu quả với các khóa học được thiết kế bài bản, dễ hiểu và thực tế.
            </p>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full">
              Khám phá khóa học
            </Button>
          </div>
          <div className="relative">
            <img
              src="./hero-student.png"
              alt="Học viên đang học"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
