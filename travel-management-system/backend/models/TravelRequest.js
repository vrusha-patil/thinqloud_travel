const mongoose = require('mongoose');

const travelRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  travelMode: {
    type: String,
    enum: ['Flight', 'Train', 'Bus', 'Car'],
    required: true
  },
  accommodationRequired: {
    type: Boolean,
    default: true
  },
  estimatedCosts: {
    travel: { type: Number, default: 0 },
    hotel: { type: Number, default: 0 },
    food: { type: Number, default: 0 },
    other: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  status: {
    type: String,
    enum: ['Draft', 'Pending Approval', 'Approved', 'Rejected', 'Completed'],
    default: 'Pending Approval'
  },
  managerComment: {
    type: String
  }
}, { timestamps: true });

// Pre-save hook to calculate total estimated cost
travelRequestSchema.pre('save', function() {
  const costs = this.estimatedCosts || {};
  this.estimatedCosts.total = (costs.travel || 0) + (costs.hotel || 0) + (costs.food || 0) + (costs.other || 0);
});

module.exports = mongoose.model('TravelRequest', travelRequestSchema);
