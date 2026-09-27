const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  maxHotelAllowance: {
    type: Number,
    default: 4000
  },
  dailyMealAllowance: {
    type: Number,
    default: 1000
  },
  receiptRequiredAbove: {
    type: Number,
    default: 500
  }
}, { timestamps: true });

module.exports = mongoose.model('Policy', policySchema);
