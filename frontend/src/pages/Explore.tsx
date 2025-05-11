import  { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoIosSearch } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { FaRegUserCircle } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import { FaArrowRight } from "react-icons/fa";
import {  FaScissors } from "react-icons/fa6";
import HRS1 from "../assets/images/HRS1.jpg";
import HRS2 from "../assets/images/HRS2.jpg";
import HRS3 from "../assets/images/HRS3.jpg";
import HRS4 from "../assets/images/HRS4.jpg";
import HRS5 from "../assets/images/HRS5.jpg";
import HRS6 from "../assets/images/HRS6.jpg";
import HRS7 from "../assets/images/HRS7.jpg";
import HRS8 from "../assets/images/HRS8.jpg";
import HRS9 from "../assets/images/HRS9.jpg";
import HRS10 from "../assets/images/HRS10.jpg";
import HRS11 from "../assets/images/HRS11.jpg";
import HRS12 from "../assets/images/HRS12.jpg";
import PR1 from "../assets/images/PR1.jpg";
import PR2 from "../assets/images/PR2.jpg";
import Footer from '@/components/common/Footer';
import Faqs from '@/components/faqs';
import Recomendations from '@/components/Recomendations';
import PromoSection from '@/components/PromoCodes';

export default function Explore() {
  const [location, setLocation] = useState('Banglore');
  
    const services = [
        { name: 'Hair Services', image: HRS1 },
        { name: 'Nail Services', image: HRS2 },
        { name: 'Skincare', image: HRS3 },
        { name: 'Waxing and Hair Removal', image: HRS4 },
        { name: 'Makeup Services', image: HRS5 },
        { name: 'Spa Services', image: HRS6 },
        { name: 'Spa Services', image: HRS7 },
        { name: 'Spa Services', image: HRS8 },
        { name: 'Spa Services', image: HRS9 },
        { name: 'Spa Services', image: HRS10 },
        { name: 'Spa Services', image: HRS11 },
        { name: 'Spa Services', image: HRS12 },
        
    ];


    return (
        <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <FaScissors className="h-6 w-6 text-orange-600" />
                        <span className="text-xl font-semibold">SALON-X</span>
                    </Link>
                    <div className="ml-8 flex items-center gap-2">
                        <FiMapPin className="h-4 w-4 text-gray-400" />
                        <select 
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="text-sm border-none focus:ring-0"
                        >
                        <option>Banglore</option>
                        <option>Mumbai</option>
                        <option>Delhi</option>
                        </select>
                    </div>
                    </div>
                    
                    <div className="flex-1 max-w-2xl mx-8">
                    <div className="relative">
                        <IoIosSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                        type="text"
                        placeholder="Search for salon, services..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
                    </div>

                    <div className="flex items-center gap-4">
                    <button className="relative">
                        <FaShoppingCart className="h-6 w-6 text-gray-600" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
                    </button>
                    <Link to="/signin" className="flex items-center gap-2 text-sm font-medium">
                        <FaRegUserCircle className="h-6 w-6" />
                        Sign In
                    </Link>
                    </div>
                </div>
            </div>
        </header>

        <main>
            {/* Services Section */}
            <section className="py-8 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">What are you looking for?</h2>
                    <Link to="/services" className="text-orange-600 hover:text-orange-700 flex items-center gap-1">
                        Explore all
                        <FaArrowRight className="h-4 w-4" />
                    </Link>
                    </div>
                    
                    <div className="grid grid-cols-6 gap-6">
                    {services.map((service, index) => (
                        <div key={index} className="text-center">
                        <div className="aspect-square rounded-full overflow-hidden mb-2">
                            <img
                            src={service.image}
                            alt={service.name}
                            className="w-full h-full object-cover"
                            />
                        </div>
                        <p className="text-sm">{service.name}</p>
                        </div>
                    ))}
                    </div>
                </div>
            </section>

            {/* Promo Codes */}

            <PromoSection />
            {/* Recommend Section  */}
            <Recomendations />
            {/* Partner Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8">
                    {/* Become a Partner Card */}
                    <div className="bg-[#F8F0FF] rounded-2xl p-8 relative overflow-hidden">
                        <div className="max-w-md">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Would you like to become a partner with SalonX?
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Cut the phone tag. Find your next appointment and book instantly anytime, anywhere.
                        </p>
                        <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
                            ADD SALON
                        </button>
                        </div>
                        <img 
                        src= {PR1}
                        alt="Partner illustration" 
                        className="absolute bottom-0 right-0 h-64"
                        />
                    </div>

                    {/* Existing Partner Card */}
                    <div className="bg-[#F3FFE9] rounded-2xl p-8 relative overflow-hidden">
                        <div className="max-w-md">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            I am currently affiliated as a partner with SalonX.
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Cut the phone tag. Find your next appointment and book instantly anytime, anywhere.
                        </p>
                        <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors">
                            GO TO DASHBOARD
                        </button>
                        </div>
                        <img 
                        src={PR2}
                        alt="Dashboard illustration" 
                        className="absolute bottom-0 right-0 h-64"
                        />
                    </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <Faqs />

            {/* Contact Section */}
            <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-blue-400 to-purple-600 rounded-lg overflow-hidden">
                <div className="grid grid-cols-2 gap-8 p-12">
                    <div className="text-white">
                    <h2 className="text-3xl font-semibold mb-4">Have a any Concern?</h2>
                    <p className="mb-8">
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        It has been in the industry&apos;s standard dummy text.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                        <span className="text-sm">Email us</span>
                        <a href="mailto:contact@salonx.com" className="text-sm">contact@salonx.com</a>
                        </div>
                        <div className="flex items-center gap-2">
                        <span className="text-sm">Call us</span>
                        <a href="tel:06-01-22-22-24" className="text-sm">06-01-22-22-24</a>
                        </div>
                    </div>
                    </div>

                    <div className="bg-white rounded-lg p-6">
                    <form className="space-y-4">
                        <select className="w-full p-3 border rounded-lg">
                        <option>Select Topic</option>
                        </select>
                        <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="First name"
                            className="p-3 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Last name"
                            className="p-3 border rounded-lg"
                        />
                        </div>
                        <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 border rounded-lg"
                        />
                        <textarea
                        placeholder="Message"
                        rows={4}
                        className="w-full p-3 border rounded-lg"
                        />
                        <div className="flex items-center gap-2">
                        <input type="checkbox" id="privacy" className="rounded" />
                        <label htmlFor="privacy" className="text-sm text-gray-600">
                            By selecting this, you agree to the Privacy Policy and Cookie Policy
                        </label>
                        </div>
                        <button
                        type="submit"
                        className="w-full bg-black text-white py-3 rounded-lg"
                        >
                        SEND →
                        </button>
                    </form>
                    </div>
                </div>
                </div>
            </div>
            </section>
            {/* map section */}
            <section className="py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-8">
                <div className="space-y-8">
                    <div>
                    <h3 className="text-lg font-semibold uppercase mb-4">SOCIAL NETWORK</h3>
                    <h2 className="text-2xl font-semibold mb-6">Follow us on our network</h2>
                    <div className="flex gap-4">
                        <a href="#" className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 hover:bg-orange-200">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                        </a>
                        <a href="#" className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 hover:bg-orange-200">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                        </a>
                        <a href="#" className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 hover:bg-orange-200">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                        </a>
                        <a href="#" className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 hover:bg-orange-200">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                        </a>
                        <a href="#" className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 hover:bg-orange-200">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                        </svg>
                        </a>
                    </div>
                    </div>

                    <div>
                    <h3 className="text-lg font-semibold uppercase mb-4">NEWSLETTER</h3>
                    <h2 className="text-2xl font-semibold mb-6">Be the first to know</h2>
                    <form className="space-y-4">
                        <input
                        type="email"
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button className="w-full bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors">
                        SUBSCRIBE
                        </button>
                    </form>
                    </div>
                </div>

                <div className="relative h-[380px] rounded-lg overflow-hidden">
                    <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304603!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sin!4v1645868686799!5m2!1sen!2sin"
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    ></iframe>
                </div>
                </div>
            </div>
            </section>
            {/* Footer */}
            <Footer />
        </main>
        </div>
    );
}
