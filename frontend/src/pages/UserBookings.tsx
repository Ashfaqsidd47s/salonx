/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '@/components/common/Footer';
import HeroSection from '@/components/HeroSection';

// Define interfaces for booking data
interface Service {
  serviceId: string;
  name: string;
  price: number;
  duration: number;
}

interface Booking {
  id: string;
  userId: string;
  salonId: string;
  services: Service[];
  date: string;
  timeSlot: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  salonName?: string;
}

interface Salon {
  name: string;
}

function UserBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please sign in to view bookings.');
        }

        // Fetch bookings
        const bookingsResponse = await axios.get('http://localhost:8080/api/salon/bookings/user', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const bookingsData: Booking[] = bookingsResponse.data;

        // Fetch salon names for each booking
        const bookingsWithSalonNames = await Promise.all(
          bookingsData.map(async (booking) => {
            try {
              const salonResponse = await axios.get(`http://localhost:8080/api/salon/${booking.salonId}`);
              return { ...booking, salonName: salonResponse.data.name };
            } catch (err) {
              return { ...booking, salonName: 'Unknown Salon' };
            }
          })
        );

        setBookings(bookingsWithSalonNames);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load bookings.';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Calculate time remaining until booking
  const getTimeRemaining = (bookingDate: string, timeSlot: string) => {
    const parseTimeSlot = (slot: string) => {
      const match = slot.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return new Date(bookingDate);
      const [_, hours, minutes, period] = match;
      let hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);
      if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
      if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
      const date = new Date(bookingDate);
      date.setHours(hour, minute, 0, 0);
      return date;
    };

    const bookingTime = parseTimeSlot(timeSlot);
    const now = new Date();
    const diffMs = bookingTime.getTime() - now.getTime();

    if (diffMs <= 0) return null; // Past booking

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''}, ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    if (diffHours > 0) return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
    return 'Today';
  };

  // Check if booking is in the past
  const isPastBooking = (bookingDate: string, timeSlot: string) => {
    const parseTimeSlot = (slot: string) => {
      const match = slot.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return new Date(bookingDate);
      const [_, hours, minutes, period] = match;
      let hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);
      if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
      if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
      const date = new Date(bookingDate);
      date.setHours(hour, minute, 0, 0);
      return date;
    };

    const bookingTime = parseTimeSlot(timeSlot);
    return bookingTime.getTime() < Date.now();
  };

  // Skeleton Loading Component
  const Skeleton = ({ className }: { className: string }) => (
    <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />
  );

  if (loading) {
    return (
      <section className="py-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-9 w-1/2 mx-auto mb-8" />
          <div className="space-y-4">
            {Array(3).fill(0).map((_, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg shadow-sm">
                <Skeleton className="h-6 w-1/3 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <>
      <main className="p-4 md:p-6 bg-gray-50 min-h-screen">
        <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick pauseOnHover />
        <div className="max-w-7xl mx-auto px-4">
          <HeroSection />
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Bookings</h1>
          {bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <div className="text-6xl text-gray-300">0</div>
              </div>
              <p className="text-gray-500">You have no bookings.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className={`p-4 border border-gray-200 rounded-lg shadow-sm transition-opacity ${
                    isPastBooking(booking.date, booking.timeSlot) ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{booking.salonName}</h3>
                      <p className="text-gray-600 text-sm">
                        Services: {booking.services.map((s) => s.name).join(', ')}
                      </p>
                      <p className="text-gray-600 text-sm">
                        Date: {new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-gray-600 text-sm">Time: {booking.timeSlot}</p>
                      <p className="text-gray-600 text-sm">Status: {booking.status}</p>
                      {getTimeRemaining(booking.date, booking.timeSlot) && (
                        <p className="text-amber-600 text-sm">
                          Time Remaining: {getTimeRemaining(booking.date, booking.timeSlot)}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-gray-800 font-medium">
                        Total: ${booking.services.reduce((sum, s) => sum + s.price, 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default UserBookings;