import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

// Helper function to format salon data for simplified response
const formatSalon = (salon, userLocation = null) => {
  // Placeholder distance (replace with geolocation logic if userLocation provided)
  const distance = (Math.random() * 9 + 1).toFixed(1); // Random 1–10 km
  // Placeholder rating (replace with actual rating logic if available)
  const rating = (Math.random() * 2 + 3).toFixed(2); // Random 3–5

  // Get hours (use Monday's hours or default if closed)
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

// 1. Recommendation Route: Get 10 random salons
router.get('/recommendations', async (req, res) => {
  try {
    const salons = await User.aggregate([
      { $match: { role: 'provider' } },
      { $sample: { size: 10 } }, // Randomly select 10 salons
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

    // Filter by servicesFor (type: Male, Female, Unisex)
    if (type) {
      query.servicesFor = { $in: [type] };
    }

    // Filter by businessCategories (services)
    if (services) {
      const serviceArray = services.split(',').map((s) => s.trim());
      query.businessCategories = { $in: serviceArray };
    }

    // Filter by city (case-insensitive)
    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    const salons = await User.find(query).limit(20); // Limit to 20 results for performance
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

    // Placeholder rating and distance (replace with actual logic if available)
    const rating = (Math.random() * 2 + 3).toFixed(2); // Random 3–5
    const distance = (Math.random() * 9 + 1).toFixed(1); // Random 1–10 km

    // Convert businessHours Map to plain object for response
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
      email: salon.email, // Added email as per SalonInfo.tsx
      phone: salon.phone, // Use phone directly (no countryCode in the model)
      services: salon.services, // Include services for SalonDetails.tsx
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

export default router;