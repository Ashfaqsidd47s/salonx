import { Link, useNavigate } from 'react-router-dom';
import { FaScissors,  } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa";
import { FiUsers } from "react-icons/fi";
import { FaUser } from "react-icons/fa";
import { LuBuilding2 } from "react-icons/lu";
import Banner2 from "../assets/images/Banner2.jpg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen">
      {/* Left side - Image */}
      <div className="hidden md:block w-1/2 relative">
        <img
          src={Banner2}
          alt="Salon tools"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <FaScissors className="h-6 w-6 text-black" />
          <span className="text-white text-xl font-semibold">SALON-X</span>
        </div>
      </div>

      {/* Right side - User Type Selection */}
      <div className="w-full md:w-full flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="absolute top-4 left-4">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              <FaArrowLeft className="h-6 w-6" />
            </Link>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">How would you like to continue?</h2>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => navigate('/signup')}
              className="w-full p-4 text-left bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200 group"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <FiUsers className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">I&apos;m a client</h3>
                  <p className="text-sm text-gray-600">Streamlining Your Salon Experience, One Click at a Time</p>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"
                  alt="Client"
                  className="ml-auto w-16 h-16 object-cover rounded-lg"
                />
              </div>
            </button>

            <button 
              onClick={() => navigate('/signup-salon')}
              className="w-full p-4 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <FaUser className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">I&apos;m a stylist</h3>
                  <p className="text-sm text-gray-600">Empowering Stylists to Showcase Their Talent and Grow Their Business</p>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=100"
                  alt="Stylist"
                  className="ml-auto w-16 h-16 object-cover rounded-lg"
                />
              </div>
            </button>

            <button
             onClick={() => navigate('/signup-salon')}
            className="w-full p-4 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200">
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  <LuBuilding2 className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">We&apos;re Salon</h3>
                  <p className="text-sm text-gray-600">Register Your Salon Today and Simplify Bookings for Your Clients</p>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=100"
                  alt="Salon"
                  className="ml-auto w-16 h-16 object-cover rounded-lg"
                />
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/signin" className="text-orange-600 hover:text-orange-500 font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center text-xs text-gray-400">
            By proceeding, you agree to the Terms and Conditions and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  )
}
