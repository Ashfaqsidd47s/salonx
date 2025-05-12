import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import verifyToken from '../middleware/verifyToken.js'; // Assuming this middleware exists
import dotenv from 'dotenv';

dotenv.config()

const router = express.Router();

// Helper function to format salon data for simplified response
const formatSalon = (salon, userLocation = null) => {
  const distance = (Math.random() * 9 + 1).toFixed(1); // Random 1–10 km
  const rating = (Math.random() * 2 + 3).toFixed(2); // Random 3–5

  const hoursData =
    salon.businessHours instanceof Map
      ? salon.businessHours.get('Monday') || { open: true, start: '10:00 AM', end: '8:00 PM' }
      : salon.businessHours?.Monday || { open: true, start: '10:00 AM', end: '8:00 PM' };
  const hours = hoursData.open ? `${hoursData.start} - ${hoursData.end}` : 'Closed';

  return {
    id: salon._id.toString(),
    name: salon.businessName,
    type: salon.servicesFor.includes('Unisex') ? 'Unisex' : salon.servicesFor[0] || 'Unisex',
    rating: parseFloat(rating),
    address: `${salon.address.address}, ${salon.address.city}, ${salon.address.state} ${salon.address.zip}`,
    hours,
    distance: `${distance} km`,
    image: salon.businessImages[0] || 'https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  };
};

// Helper function to get the next occurrence of a day
const getNextDayDate = (day) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const targetDayIndex = daysOfWeek.indexOf(day);
  if (targetDayIndex === -1) throw new Error('Invalid day');

  const today = new Date();
  const currentDayIndex = today.getDay();
  let daysUntilTarget = targetDayIndex - currentDayIndex;
  if (daysUntilTarget <= 0) daysUntilTarget += 7; // Move to next week if day is today or past

  const nextDate = new Date(today);
  nextDate.setDate(today.getDate() + daysUntilTarget);
  nextDate.setHours(0, 0, 0, 0); // Reset time to midnight
  return nextDate;
};

// 1. Recommendation Route: Get 10 random salons
router.get('/recommendations', async (req, res) => {
  try {
    const salons = await User.aggregate([
      { $match: { role: 'provider' } },
      { $sample: { size: 10 } },
    ]);

    const formattedSalons = salons.map((salon) => formatSalon(salon));
    res.status(200).json(formattedSalons);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 2. Search Route: Filter salons by type, services, and location
router.get('/search', async (req, res) => {
  try {
    const { type, services, city } = req.query;
    const query = { role: 'provider' };

    if (type) {
      query.servicesFor = { $in: [type] };
    }

    if (services) {
      const serviceArray = services.split(',').map((s) => s.trim());
      query.businessCategories = { $in: serviceArray };
    }

    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    const salons = await User.find(query).limit(20);
    const formattedSalons = salons.map((salon) => formatSalon(salon));
    res.status(200).json(formattedSalons);
  } catch (error) {
    console.error('Error searching salons:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 3. Salon Details Route: Get full details of a salon by ID
router.get('/:id', async (req, res) => {
  try {
    const salon = await User.findOne({ _id: req.params.id, role: 'provider' });
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    const rating = (Math.random() * 2 + 3).toFixed(2);
    const distance = (Math.random() * 9 + 1).toFixed(1);

    const businessHoursObject = salon.businessHours instanceof Map
      ? Object.fromEntries(
          Array.from(salon.businessHours.entries()).map(([day, { open, start, end }]) => [
            day,
            { open, start, end },
          ])
        )
      : salon.businessHours || {};

    const response = {
      id: salon._id.toString(),
      name: salon.businessName,
      type: salon.servicesFor.includes('Unisex') ? 'Unisex' : salon.servicesFor[0] || 'Unisex',
      rating: parseFloat(rating),
      address: {
        address: salon.address.address,
        street: salon.address.street,
        city: salon.address.city,
        state: salon.address.state,
        zip: salon.address.zip,
        country: salon.address.country,
      },
      hours: businessHoursObject,
      distance: `${distance} km`,
      images: salon.businessImages,
      menuImages: salon.menuImages,
      certificates: salon.certificates,
      categories: salon.businessCategories,
      servicesFor: salon.servicesFor,
      serviceLocation: salon.serviceLocation,
      description: salon.description,
      email: salon.email,
      phone: salon.phone,
      services: salon.services,
      createdAt: salon.createdAt,
      updatedAt: salon.updatedAt,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching salon details:', error);
    if (error instanceof mongoose.CastError) {
      return res.status(400).json({ message: 'Invalid salon ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// 4. Create Booking Route: Book services at a salon
router.post('/bookings', verifyToken, async (req, res) => {
  try {
    const { salonId, services, day, timeSlot } = req.body;

    // Validate request
    if (!salonId || !services || !day || !timeSlot) {
      return res.status(400).json({ message: 'Salon ID, services, day, and time slot are required' });
    }
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: 'Services must be a non-empty array' });
    }

    // Validate salon
    const salon = await User.findOne({ _id: salonId, role: 'provider' });
    if (!salon) {
      return res.status(404).json({ message: 'Salon not found' });
    }

    // Validate services
    const validServiceIds = salon.services.map((s) => s._id.toString());
    const bookingServices = services.map((s) => ({
      serviceId: s._id,
      name: s.name,
      price: s.price,
      duration: s.duration,
    }));

    for (const service of bookingServices) {
      if (!validServiceIds.includes(service.serviceId)) {
        return res.status(400).json({ message: `Invalid service ID: ${service.serviceId}` });
      }
      if (!service.name || typeof service.price !== 'number' || typeof service.duration !== 'number') {
        return res.status(400).json({ message: 'Invalid service details' });
      }
    }

    // Convert day to date (next occurrence)
    const bookingDate = getNextDayDate(day);

    // Create booking
    const booking = new Booking({
      userId: req.user.id,
      salonId,
      services: bookingServices,
      date: bookingDate,
      timeSlot,
      status: 'confirmed',
    });

    await booking.save();

    // Format response
    const response = {
      id: booking._id.toString(),
      userId: booking.userId.toString(),
      salonId: booking.salonId.toString(),
      services: booking.services,
      date: booking.date,
      timeSlot: booking.timeSlot,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating booking:', error);
    if (error instanceof mongoose.CastError) {
      return res.status(400).json({ message: 'Invalid salon or user ID' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// 5. User Bookings Route: Get all bookings made by the authenticated user
router.get('/bookings/user', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort({ date: 1, timeSlot: 1 });

    if (!bookings || bookings.length === 0) {
      return res.status(200).json([]);
    }

    const formattedBookings = bookings.map((booking) => ({
      id: booking._id.toString(),
      userId: booking.userId.toString(),
      salonId: booking.salonId.toString(),
      services: booking.services,
      date: booking.date,
      timeSlot: booking.timeSlot,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 6. Salon Bookings Route: Get all bookings made for the authenticated salon
router.get('/bookings/salon', verifyToken, async (req, res) => {
  try {
    // Verify the user is a provider
    const salon = await User.findOne({ _id: req.user.id, role: 'provider' });
    if (!salon) {
      return res.status(403).json({ message: 'Access denied: User is not a salon provider' });
    }

    const bookings = await Booking.find({ salonId: req.user.id }).sort({ date: 1, timeSlot: 1 });

    if (!bookings || bookings.length === 0) {
      return res.status(200).json([]);
    }

    const formattedBookings = bookings.map((booking) => ({
      id: booking._id.toString(),
      userId: booking.userId.toString(),
      salonId: booking.salonId.toString(),
      services: booking.services,
      date: booking.date,
      timeSlot: booking.timeSlot,
      status: booking.status,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error('Error fetching salon bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;