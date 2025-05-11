import { FaScissors } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#1C1C1C] text-gray-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-4 gap-8 pb-12">
                {/* Logo and Description */}
                <div className="col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                    <FaScissors className="h-8 w-8 text-orange-500" />
                    <span className="text-white text-2xl font-bold">SALON-X</span>
                    </div>
                    <p className="text-sm text-gray-400">
                    SalonX offers a luxurious and innovative salon experience, blending cutting-edge techniques with personalized service to bring out the best in every client
                    </p>
                </div>

                {/* Links */}
                <div className="col-span-1">
                    <h3 className="text-orange-500 font-semibold mb-6">LINK</h3>
                    <ul className="space-y-3">
                    <li><Link to="/" className="hover:text-white transition-colors">Unisex Services</Link></li>
                    <li><Link to="/" className="hover:text-white transition-colors">Women Services</Link></li>
                    <li><Link to="/" className="hover:text-white transition-colors">Men Services</Link></li>
                    <li><Link to="/" className="hover:text-white transition-colors">Our history</Link></li>
                    <li><Link to="/" className="hover:text-white transition-colors">Contact</Link></li>
                    </ul>
                </div>

                {/* About */}
                <div className="col-span-1">
                    <h3 className="text-orange-500 font-semibold mb-6">ABOUT</h3>
                    <ul className="space-y-3">
                    <li><Link to="/" className="hover:text-white transition-colors">FAQ</Link></li>
                    <li><Link to="/" className="hover:text-white transition-colors">Contact us</Link></li>
                    <li><Link to="/" className="hover:text-white transition-colors">Terms and Conditions</Link></li>
                    <li><Link to="/" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                    <li><Link to="/" className="hover:text-white transition-colors">Terms of Use</Link></li>
                    </ul>
                </div>

                {/* Contact */}
                <div className="col-span-1">
                    <h3 className="text-orange-500 font-semibold mb-6">CONTACT</h3>
                    <ul className="space-y-3">
                    <li>contact@salonx.com</li>
                    <li>+33 888 666 433</li>
                    <li>Empire State Building, New York</li>
                    <li>9h00 - 17h00</li>
                    </ul>
                </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
                © 2024 Salon X. All rights reserved.
                </div>
            </div>
    </footer>
  )
}
