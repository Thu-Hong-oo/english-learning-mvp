import React from 'react'
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react'

const Footer = () => {
    return (
        <div>
            <footer className="bg-white border-t border-gray-200 py-16">
                <div className="container mx-auto px-20">
                    <div className="flex flex-nowrap justify-between items-start space-x-8 md:space-x-16 lg:space-x-24">
                        {/* Thông tin công ty */}
                        <div className="space-y-4 max-w-[500px]">
                            <img src="./LOGO.png" alt="" />
                            <p className="text-justify leading-relaxed">Nền tảng học tập trực tuyến giúp bạn nâng cao kỹ năng với nội dung chất lượng và lộ trình rõ ràng.</p>

                        </div>

                        <div className="space-y-4">
                            <h2 className="font-bold text-xl">HỖ TRỢ</h2>

                            <ol className="space-y-4">
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">Liên hệ</a></li>
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">Bài viết mới</a></li>
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">Câu hỏi thường gặp</a></li>
                            </ol>
                        </div>

                        <div className="space-y-4">
                            <h2 className="font-bold text-xl">CHƯƠNG TRÌNH</h2>
                            <ol className="space-y-4">
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">Thiết kế</a></li>
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">Kinh doanh</a></li>
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">CNTT & Phần mềm</a></li>
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">Ngôn ngữ</a></li>
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">Lập trình</a></li>
                            </ol>
                        </div>

                        <div className="space-y-4">
                            <h2 className="font-bold text-xl">LIÊN HỆ</h2>
                            <div className="flex-row space-y-4">
                                <p>Địa chỉ: 2311 New Design, Lorem, USA</p>
                                <p>Điện thoại: + (123)1267428492</p>
                                <p>Email: thuhong05022003@gmail.com</p>
                                <div className="flex space-x-4">
                                    <Facebook className="w-5 h-5 text-blue-700 hover:text-orange-500"></Facebook>
                                    <Twitter className="w-5 h-5 text-blue-400 hover:text-orange-500 cursor-pointer" />
                                    <Instagram className="w-5 h-5 text-pink-400 hover:text-orange-500 cursor-pointer" />
                                    <Youtube className="w-5 h-5 text-red-400 hover:text-orange-500 cursor-pointer" />
                                    <Linkedin className="w-5 h-5 text-blue-600 hover:text-orange-500 cursor-pointer" />
                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer
