const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TravelRequest',
    required: true
  },
  type: {
    type: String,
    enum: ['Transportation', 'Hotel', 'Other'],
    required: true
  },
  provider: {
    type: String,
    required: true
  },
  bookingReference: {
    type: String,
    required: true
  },
  departure: {
    type: Date
  },
  arrival: {
    type: Date
  },
  cost: {
    type: Number,
    required: true
  },
  bookedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
