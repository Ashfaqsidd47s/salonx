/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { Button } from './ui/button';

// Define necessary interfaces
interface BusinessHoursDay {
  open: boolean;
  start: string;
  end: string;
}

interface BusinessHours {
  [day: string]: BusinessHoursDay;
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

interface CheckoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  businessHours: BusinessHours;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onCheckout: (day: string, timeSlot: string) => void;
}

const CheckoutDialog: React.FC<CheckoutDialogProps> = ({
  isOpen,
  onOpenChange,
  businessHours,
  cartItems,
  setCartItems,
  onCheckout
}) => {
  // State for the dialog
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

  // Compute open days
  const openDays = useMemo(() => {
    return Object.entries(businessHours)
      .filter(([_, hours]) => hours.open)
      .map(([day]) => day);
  }, [businessHours]);

  // Function to generate 30-minute time slots
  const generateTimeSlots = (start: string, end: string): string[] => {
    const timeSlots: string[] = [];

    const parseTime = (time: string): Date => {
      const date = new Date();
      let hour: number, minute: number;

      // Check if the time is in 24-hour format (e.g., "20:56")
      if (/^\d{1,2}:\d{2}$/.test(time)) {
        const [hours, minutes] = time.split(':').map(Number);
        hour = hours;
        minute = minutes;
      }
      // Otherwise, assume it's in 12-hour format with AM/PM (e.g., "10:00 AM")
      else {
        const match = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) {
          throw new Error(`Invalid time format: ${time}`);
        }
        const [_, hours, minutes, period] = match;
        hour = parseInt(hours, 10);
        minute = parseInt(minutes, 10);
        if (period.toUpperCase() === 'PM' && hour !== 12) hour += 12;
        if (period.toUpperCase() === 'AM' && hour === 12) hour = 0;
      }

      date.setHours(hour, minute, 0, 0);
      return date;
    };

    const formatTime = (date: Date): string => {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const startTime = parseTime(start);
    const endTime = parseTime(end);

    // Ensure startTime is before endTime
    if (startTime > endTime) {
      throw new Error(`Start time (${start}) must be before end time (${end})`);
    }

    const currentTime = new Date(startTime);
    while (currentTime <= endTime) {
      timeSlots.push(formatTime(currentTime));
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return timeSlots;
  };

  // Compute time slots for the selected day
  const selectedDay = openDays[selectedDayIndex];
  const timeSlots = useMemo(() => {
    if (!selectedDay) return [];
    const { start, end } = businessHours[selectedDay];
    try {
      return generateTimeSlots(start, end);
    } catch (error) {
      console.error(`Error generating time slots for ${selectedDay}:`, error);
      return [];
    }
  }, [selectedDay, businessHours]);

  // Slider navigation handlers
  const handlePrevDay = () => {
    setSelectedDayIndex((prev) => (prev === 0 ? openDays.length - 1 : prev - 1));
    setSelectedTimeSlot(null);
  };

  const handleNextDay = () => {
    setSelectedDayIndex((prev) => (prev === openDays.length - 1 ? 0 : prev + 1));
    setSelectedTimeSlot(null);
  };

  // Checkout handler (fake API call)
  const handleCheckout = async () => {
    if (!selectedTimeSlot || !selectedDay) return;
    console.log(selectedDay, selectedTimeSlot)
    onCheckout(selectedDay, selectedTimeSlot);
  };

  // Reset state when dialog closes
  const handleDialogClose = (open: boolean) => {
    onOpenChange(open);
    if (!open) {
      setSelectedDayIndex(0);
      setSelectedTimeSlot(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Select a Time Slot</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {openDays.length === 0 ? (
            <p className="text-gray-500 text-center">No open days available.</p>
          ) : (
            <>
              {/* Day Slider */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handlePrevDay}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  disabled={openDays.length <= 1}
                >
                  <FaChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <span className="text-lg font-medium text-gray-800">{selectedDay}</span>
                <button
                  onClick={handleNextDay}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  disabled={openDays.length <= 1}
                >
                  <FaChevronRight className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              {/* Time Slots */}
              <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                {timeSlots.length === 0 ? (
                  <p className="text-gray-500 text-center col-span-3">Unable to generate time slots.</p>
                ) : (
                  timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-2 rounded-lg border text-sm font-medium transition-colors ${
                        selectedTimeSlot === slot
                          ? 'bg-amber-600 text-white border-amber-600'
                          : 'bg-white border-gray-200 text-gray-800 hover:bg-amber-50 hover:border-amber-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))
                )}
              </div>

              {/* Selected Time Slot */}
              {selectedTimeSlot && (
                <p className="mt-4 text-gray-600">
                  Selected: <span className="font-medium text-amber-600">{selectedDay}, {selectedTimeSlot}</span>
                </p>
              )}
            </>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={() => handleDialogClose(false)}
            className="bg-gray-200 text-gray-800 py-2 px-4  hover:bg-gray-300 transition-colors rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCheckout}
            className="bg-amber-600 text-white py-2 px-4  hover:bg-amber-700 transition-colors rounded-lg"
            disabled={!selectedTimeSlot}
          >
            Confirm Booking
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutDialog;