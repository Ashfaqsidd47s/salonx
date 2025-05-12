import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config()

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/';
    // Create the directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png) and PDFs are allowed!'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
});

// Middleware to handle multiple file fields
const uploadFields = upload.fields([
  { name: 'businessImages', maxCount: 10 },
  { name: 'menuImages', maxCount: 10 },
  { name: 'certificates', maxCount: 10 },
  { name: 'serviceImages', maxCount: 10 },
]);

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: 'File upload error', error: err.message });
  } else if (err) {
    return res.status(400).json({ message: 'File upload error', error: err.message });
  }
  next();
};

const router = express.Router();

// REGISTER ROUTE (USER)
router.post('/user/register', async (req, res) => {
  try {
    const { firstName, lastName, email, businessName, phone, password } = req.body;

    if (!firstName || !lastName || !email || !businessName || !phone || !password) {
      return res.status(400).json({ message: 'All required fields (firstName, lastName, email, businessName, phone, password) must be provided' });
    }

    // Validate phone length (10 to 20 characters)
    if (phone.length < 10 || phone.length > 20) {
      return res.status(400).json({ message: 'Phone number must be between 10 and 20 characters long' });
    }

    if (await User.findOne({ email })) {
      return res.status(403).json({ message: 'Email already taken' });
    }

    const user = new User({
      firstName,
      lastName,
      email,
      businessName,
      phone,
      password,
      role: 'user',
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
    console.log(err);
  }
});

// LOGIN ROUTE (USER)
router.post('/user/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email, role: 'user' });
    if (!user) {
      return res.status(403).json({ message: 'Email not found' });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        businessName: user.businessName,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

// REGISTER ROUTE (PROVIDER)
router.post('/provider/register', uploadFields, handleMulterError, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      businessName,
      phone,
      password,
      businessCategories,
      servicesFor,
      description,
      serviceLocation,
      address,
      businessHours,
      services,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !businessName || !phone || !password) {
      return res.status(400).json({ message: 'All required fields (firstName, lastName, email, businessName, phone, password) must be provided' });
    }

    // Validate phone length (10 to 20 characters)
    if (phone.length < 10 || phone.length > 20) {
      return res.status(400).json({ message: 'Phone number must be between 10 and 20 characters long' });
    }

    // Check if email is already taken
    if (await User.findOne({ email })) {
      return res.status(403).json({ message: 'Email already taken' });
    }

    // Handle file uploads
    const businessImages = req.files?.businessImages
      ? req.files.businessImages.map((file) => file.path)
      : [];
    const menuImages = req.files?.menuImages
      ? req.files.menuImages.map((file) => file.path)
      : [];
    const certificates = req.files?.certificates
      ? req.files.certificates.map((file) => file.path)
      : [];
    const serviceImages = req.files?.serviceImages
      ? req.files.serviceImages.map((file) => file.path)
      : [];

    // Handle fields that should be arrays (businessCategories, servicesFor, serviceLocation)
    const parsedBusinessCategories = businessCategories
      ? Array.isArray(businessCategories)
        ? businessCategories
        : typeof businessCategories === 'string'
        ? JSON.parse(businessCategories)
        : [businessCategories]
      : [];

    const parsedServicesFor = servicesFor
      ? Array.isArray(servicesFor)
        ? servicesFor
        : [servicesFor]
      : [];

    const parsedServiceLocation = serviceLocation
      ? Array.isArray(serviceLocation)
        ? serviceLocation
        : typeof serviceLocation === 'string'
        ? JSON.parse(serviceLocation)
        : [serviceLocation]
      : [];

    // Parse JSON fields for complex objects/arrays (address, businessHours, services)
    const parsedAddress = address
      ? typeof address === 'string'
        ? JSON.parse(address)
        : address
      : {};

    const parsedBusinessHours = businessHours
      ? typeof businessHours === 'string'
        ? JSON.parse(businessHours)
        : businessHours
      : {};

    let parsedServices = services
      ? typeof services === 'string'
        ? JSON.parse(services)
        : services
      : [];

    // Validate number of serviceImages
    if (serviceImages.length > parsedServices.length) {
      return res.status(400).json({
        message: 'Number of service images cannot exceed the number of services',
      });
    }

    // Map service images to the corresponding service
    if (parsedServices.length > 0) {
      parsedServices = parsedServices.map((service, index) => ({
        ...service,
        image: serviceImages[index] ? serviceImages[index] : '',
      }));
    }

    const user = new User({
      firstName,
      lastName,
      email,
      businessName,
      phone,
      password,
      role: 'provider',
      businessCategories: parsedBusinessCategories,
      businessImages,
      menuImages,
      certificates,
      servicesFor: parsedServicesFor,
      description: description || '',
      serviceLocation: parsedServiceLocation,
      address: parsedAddress,
      businessHours: parsedBusinessHours,
      services: parsedServices,
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({ message: 'Provider registered successfully', token });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
    console.log(err);
  }
});

// LOGIN ROUTE (PROVIDER)
router.post('/provider/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email, role: 'provider' });
    if (!user) {
      return res.status(403).json({ message: 'Email not found' });
    }

    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful', 
      token,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        businessName: user.businessName,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const user = await User.findById(decoded.id).select('firstName lastName email businessName role');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      businessName: user.businessName,
      role: user.role,
    });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
    res.status(500).json({ message: 'Something went wrong', error: err.message });
  }
});

// TEST ROUTE
router.get('/', (req, res) => {
  res.status(200).json({ message: 'Auth router is working fine' });
});

export default router;