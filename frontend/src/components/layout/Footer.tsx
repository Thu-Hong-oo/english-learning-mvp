import React from 'react'
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from 'lucide-react'

const Footer = () => {
    return (
        <div>
            <footer className="bg-white border-t border-gray-200 py-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-nowrap justify-between items-start space-x-8 md:space-x-16 lg:space-x-24">
                        {/*Company infor */}
                        <div className="space-y-4 max-w-[500px]">
                            <img src="./LOGO.png" alt="" />
                            <p className="text-justify leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure iste laboriosam ad, labore voluptates atque minima quae pariatur deserunt vitae illum, libero quas dolor nesciunt at qui beatae earum. Exercitationem!</p>

                        </div>

                        <div className="space-y-4">
                            <h2 className="font-bold text-xl">GET HELP</h2>

                            <ol className="space-y-4">
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">Contact Us</a></li>
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">Lastest Artical</a></li>
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">FAQ</a></li>
                            </ol>
                        </div>

                        <div className="space-y-4">
                            <h2 className="font-bold text-xl">PROGRAMS</h2>
                            <ol className="space-y-4">
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">Ant & Design</a></li>
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">Business</a></li>
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">IT & Software</a></li>
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">Languges</a></li>
                                <li><a href="" className="text-gray-600 hover:text-orange-500 text-sm">Progaming</a></li>
                            </ol>
                        </div>

                        <div className="space-y-4">
                            <h2 className="font-bold text-xl">CONTACT US</h2>
                            <div className="flex-row space-y-4">
                                <p>Address : 2311 New Design, Lorem, USA</p>
                                <p>Tel : + (123)1267428492</p>
                                <p>Mail: thuhong05022003@gmail.com</p>
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
