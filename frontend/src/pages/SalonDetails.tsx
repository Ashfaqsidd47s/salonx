/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ServiceGallery from '@/components/ServiceGalary';
import HeroSection from '@/components/HeroSection';
import SalonInfo from '@/components/SalonInfo';
import BusinessHours from '@/components/BussinessHour';
import Footer from '@/components/common/Footer';
import { FaClock, FaScissors } from 'react-icons/fa6';
import { CiShoppingTag } from 'react-icons/ci';
import CheckoutDialog from '@/components/CheckoutModal';
import { FaRegUserCircle, FaShoppingCart } from 'react-icons/fa';
import { IoIosSearch } from 'react-icons/io';

// Define TypeScript interfaces for the salon data
interface Address {
  address: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface Service {
  _id: string;
  name: string;
  price: number;
  duration: number;
  image: string;
}

interface CartItem extends Service {
  salonId: string; // To track which salon the service belongs to
}

interface BusinessHoursDay {
  open: boolean;
  start: string;
  end: string;
}

interface BusinessHours {
  [day: string]: BusinessHoursDay;
}

interface Salon {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  name: string;
  phone: string;
  rating: string;
  role: string;
  businessCategories: string[];
  businessImages: string[];
  menuImages: string[];
  certificates: string[];
  servicesFor: string[];
  description: string;
  distance: string;
  serviceLocation: string[];
  address: Address;
  hours: BusinessHours;
  services: Service[];
  createdAt: string;
  updatedAt: string;
}

function SalonDetails() {
  const { id } = useParams<{ id: string }>(); // Get the salon ID from the URL
  const [salon, setSalon] = useState<Salon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState<string>('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [selectedBooking, setSelectedBooking] = useState<{ day: string; timeSlot: string } | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch salon details
  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get<Salon>(`http://localhost:8080/api/salon/${id}`);
        setSalon(response.data);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to load salon details.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSalonDetails();
    }
  }, [id]);

  // Add to cart
  const handleAddToCart = (service: Service) => {
    if (!id) return;

    // Check if the service is already in the cart for this salon
    const exists = cartItems.some(
      (item) => item._id === service._id && item.salonId === id
    );
    if (exists) {
      toast.info(`${service.name} is already in your cart!`);
      return;
    }

    const cartItem: CartItem = {
      _id: service._id,
      name: service.name,
      price: service.price,
      duration: service.duration,
      image: service.image,
      salonId: id,
    };

    setCartItems((prev) => [...prev, cartItem]);
    toast.success(`${service.name} added to cart!`);
  };

  // Remove from cart
  const handleRemoveFromCart = (itemId: string) => {
    setCartItems((prev) => {
      const updatedCart = prev.filter((item) => item._id !== itemId);
      return updatedCart;
    });
    toast.info('Item removed from cart!');
  };

  // Calculate total price of items in the cart
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  // Handle time slot selection from the dialog

  const handleBooking = async (day: string, timeSlot: string) => {
    if (!id || !day || !timeSlot || cartItems.length === 0) {
      toast.error('Please select a time slot and add services to book.');
      return;
    }

    setSelectedBooking({day,timeSlot})
    console.log(selectedBooking)

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please sign in to book services.');
        return;
      }

      const bookingData = {
        salonId: id,
        services: cartItems.map((item) => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          duration: item.duration,
        })),
        day: day,
        timeSlot: timeSlot,
      };

      await axios.post('http://localhost:8080/api/salon/bookings', bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Booking confirmed successfully!');
      setCartItems([]); // Clear cart
      localStorage.removeItem('cart'); // Clear localStorage
      setIsCheckoutOpen(false); // Close checkout dialog
      setSelectedBooking(null); // Reset selected booking
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create booking.';
      toast.error(errorMessage);
    }
  };

  // Skeleton Loading Component (Shadcn UI style)
  const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />
  );

  if (loading) {
    return (
      <section className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Skeleton for Header */}
          <div className="text-center mb-8">
            <Skeleton className="h-9 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>

          {/* Skeleton for Business Images */}
          <div className="mb-8">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(3).fill(0).map((_, index) => (
                <Skeleton key={index} className="h-48 w-full rounded-lg" />
              ))}
            </div>
          </div>

          {/* Skeleton for Description */}
          <div className="mb-8">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          {/* Skeleton for Details */}
          <div className="mb-8">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>

          {/* Skeleton for Services */}
          <div className="mb-8">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array(2).fill(0).map((_, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg shadow-sm">
                  <Skeleton className="h-5 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              ))}
            </div>
          </div>

          {/* Skeleton for Business Hours */}
          <div className="mb-8">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array(7).fill(0).map((_, index) => (
                <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg shadow-sm">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !salon) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error || 'Salon data not available.'}</p>
      </div>
    );
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                  <div className="flex items-center">
                  <Link to="/" className="flex items-center gap-2">
                      <FaScissors className="h-6 w-6 text-orange-600" />
                      <span className="text-xl font-semibold">SALON-X</span>
                  </Link>
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
                    <Link to="/user/bookings">
                      <button className="relative">
                          <FaShoppingCart className="h-6 w-6 text-gray-600" />
                          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">2</span>
                      </button>
                    </Link>
                    <Link to="/signin" className="flex items-center gap-2 text-sm font-medium">
                        <FaRegUserCircle className="h-6 w-6" />
                        Sign In
                    </Link>
                  </div>
              </div>
          </div>
      </header>
      <main className="p-4 md:p-6">
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <HeroSection />
              <SalonInfo
                data={{
                  name: salon.name,
                  description: salon.description,
                  email: salon.email,
                  phone: salon.phone,
                  distance: salon.distance,
                }}
              />
            </div>
            <div className="md:col-span-1">
              <BusinessHours businessHours={salon.hours} />
              <div className="mt-6">
                <div>location</div>
              </div>
            </div>
          </div>
        </div>

        {/* Salon Images */}
        {salon.businessImages?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Business Images</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {salon.businessImages.map((image: string, index: number) => (
                <img
                  key={index}
                  src={`http://localhost:8080/${image}`}
                  alt={`Business Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg shadow-sm"
                />
              ))}
            </div>
          </div>
        )}

        {/* Categories and Services For */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          <div className="flex flex-col gap-2">
            {salon.businessCategories?.length > 0 && (
              <p>
                <span className="font-medium text-gray-900">Categories:</span>{' '}
                {salon.businessCategories.join(', ')}
              </p>
            )}
            {salon.servicesFor?.length > 0 && (
              <p>
                <span className="font-medium text-gray-900">Services For:</span>{' '}
                {salon.servicesFor.join(', ')}
              </p>
            )}
            {salon.serviceLocation?.length > 0 && (
              <p>
                <span className="font-medium text-gray-900">Service Location:</span>{' '}
                {salon.serviceLocation.join(', ')}
              </p>
            )}
          </div>
        </div>

        {/* Services */}
        {salon.services?.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {salon.services.map((service: Service, index: number) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 rounded-lg shadow-sm"
                >
                  <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                  <p className="text-gray-600">Price: ${service.price.toFixed(2)}</p>
                  <p className="text-gray-600">Duration: {service.duration} minutes</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mx-auto pb-16 px-4">
          <div className="md:col-span-2 px-4 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Services</h2>
            <div className="space-y-6">
              {salon.services.map((service) => (
                <div key={service._id} className="flex items-center justify-between border-b border-gray-200 pb-6">
                  <div className="flex items-center">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden mr-4">
                      <img
                        src={
                          'https://images.pexels.com/photos/3997981/pexels-photo-3997981.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                        }
                        alt={service.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{service.name}</h3>
                      <div className="flex items-center text-gray-500 mt-1">
                        <FaClock className="h-4 w-4 mr-1" />
                        <span>{service.duration} Min</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="text-lg font-medium text-gray-800 mr-4">
                      ${service.price.toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleAddToCart(service)}
                      className="bg-black text-white text-sm font-medium px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                      ADD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="bg-gray-100 p-6 rounded-full mb-4">
                    <div className="text-6xl text-gray-300">0</div>
                  </div>
                  <p className="text-gray-500">Your service cart is currently empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-gray-500 text-sm">${item.price.toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item._id)}
                        className="text-red-500 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium mt-4 hover:bg-amber-700 transition-colors"
                    onClick={() => setIsCheckoutOpen(true)}
                    disabled={cartItems.length === 0}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
              <div className="mt-8">
                <h3 className="font-medium mb-4">Have any promo code?</h3>
                <div className="flex">
                  <div className="flex-1 flex items-center border border-gray-300 rounded-l-lg px-3">
                    <CiShoppingTag className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                      type="text"
                      placeholder="Enter Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full py-2 outline-none"
                    />
                  </div>
                  <button className="bg-gray-100 text-gray-800 px-4 py-2 rounded-r-lg font-medium hover:bg-gray-200 transition-colors">
                    APPLY
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">Terms and Conditions</p>
              </div>
            </div>
          </div>
        </div>
        <ServiceGallery />
      </main>
      <Footer />
      {salon && (
        <CheckoutDialog
          isOpen={isCheckoutOpen}
          onOpenChange={setIsCheckoutOpen}
          businessHours={salon.hours}
          cartItems={cartItems}
          setCartItems={setCartItems}
          onCheckout={handleBooking}
        />
      )}
    </>
  );
}

export default SalonDetails;