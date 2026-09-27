const mongoose = require('mongoose');

const expenseItemSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Flight', 'Train', 'Bus', 'Car', 'Hotel', 'Food', 'Local', 'Other', 'Travel', 'Local Travel']
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String
  },
  receiptUrl: {
    type: String
  }
});

const expenseClaimSchema = new mongoose.Schema({
  claimId: {
    type: String,
    unique: true,
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TravelRequest',
    required: true
  },
  items: [expenseItemSchema],
  totalAmount: {
    type: Number,
    default: 0
  },
  approvedAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['Pending', 'Manager Verified', 'Verified', 'Approved', 'Paid', 'Rejected'],
    default: 'Pending'
  },
  managerComment: {
    type: String
  },
  financeComment: {
    type: String
  },
  receiptsVerified: {
    type: Boolean,
    default: false
  },
  paymentReference: {
    type: String
  }
}, { timestamps: true });

// Pre-save hook to calculate total actual cost
expenseClaimSchema.pre('save', function() {
  if (this.items && this.items.length > 0) {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.amount, 0);
  }
});

module.exports = mongoose.model('ExpenseClaim', expenseClaimSchema);
