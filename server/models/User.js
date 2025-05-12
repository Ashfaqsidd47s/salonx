import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Sub-schema for business hours
const businessHoursSchema = new mongoose.Schema({
  open: { type: Boolean, default: false },
  start: { type: String, default: '10:00 AM' },
  end: { type: String, default: '8:00 PM' },
});

// Sub-schema for address
const addressSchema = new mongoose.Schema({
  address: { type: String, default: '' },
  street: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zip: { type: String, default: '' },
  country: { type: String, default: '' },
});

// Sub-schema for services
const serviceSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Automatically generate an ID for each service
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  duration: { type: Number, required: true, min: 0 }, // Duration in minutes
  image: { type: String, default: '' }, // Store the file path or URL of the service image
});

// Main user schema
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [2, 'Last name must be at least 2 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  businessName: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    minlength: [3, 'Business name must be at least 3 characters'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    minlength: [10, 'Phone number must be at least 10 characters long'],
    maxlength: [20, 'Phone number cannot exceed 20 characters'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    required: true,
    enum: ['user', 'provider'],
    default: 'user',
  },
  businessCategories: {
    type: [String],
    default: [],
    enum: [
      'Aesthetic Medicine',
      'Barbershop',
      'Braids & Locs',
      'Dental & Orthodontics',
      'Hair Removal',
      'Hair Salon',
      'Health & Fitness',
      'Home Services',
      'Makeup',
    ],
  },
  businessImages: {
    type: [String], // Store file paths or URLs
    default: [],
  },
  menuImages: {
    type: [String],
    default: [],
  },
  certificates: {
    type: [String],
    default: [],
  },
  servicesFor: {
    type: [String],
    enum: ['Male', 'Female', 'Unisex'],
    default: [],
  },
  description: {
    type: String,
    default: '',
  },
  serviceLocation: {
    type: [String],
    enum: ['At my place', "At the client's location"],
    default: [],
  },
  address: {
    type: addressSchema,
    default: () => ({}),
  },
  businessHours: {
    type: Map,
    of: businessHoursSchema,
    default: {
      Sunday: { open: false, start: '10:00 AM', end: '8:00 PM' },
      Monday: { open: true, start: '10:00 AM', end: '8:00 PM' },
      Tuesday: { open: true, start: '10:00 AM', end: '8:00 PM' },
      Wednesday: { open: true, start: '10:00 AM', end: '8:00 PM' },
      Thursday: { open: true, start: '10:00 AM', end: '8:00 PM' },
      Friday: { open: true, start: '10:00 AM', end: '8:00 PM' },
      Saturday: { open: true, start: '10:00 AM', end: '8:00 PM' },
    },
  },
  services: {
    type: [serviceSchema],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  this.updatedAt = Date.now();
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;