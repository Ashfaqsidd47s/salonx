import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  salonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Salon ID is required'],
  },
  services: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      duration: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  date: {
    type: Date,
    required: [true, 'Booking date is required'],
  },
  timeSlot: {
    type: String,
    required: [true, 'Time slot is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'confirmed',
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

bookingSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;