const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const ExpenseClaim = require('../models/ExpenseClaim');

// Initialize Razorpay instance with mock keys or env variables
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'mock_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret'
});

// Generate Razorpay Order ID
router.post('/create-order', async (req, res) => {
  try {
    const { amount, expenseId } = req.body;
    
    // In a real environment, you'd call razorpayInstance.orders.create
    // For this mock implementation, we handle it internally if keys are placeholders
    let order;
    if (process.env.RAZORPAY_KEY_ID) {
      const options = {
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        receipt: `receipt_${expenseId}`
      };
      order = await razorpayInstance.orders.create(options);
    } else {
      // Mocked order generation
      order = {
        id: `order_${crypto.randomBytes(8).toString('hex')}`,
        amount: amount * 100,
        currency: 'INR',
        receipt: `receipt_${expenseId}`
      };
    }

    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify Payment and Mark ExpenseClaim as Paid
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, expenseId } = req.body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'mock_key_secret';
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', secret).update(body.toString()).digest('hex');

    // Authenticate signature (bypassed if no keys are provided for testing purposes)
    const isAuthentic = expectedSignature === razorpay_signature || !process.env.RAZORPAY_KEY_ID;

    if (isAuthentic) {
      const updatedExpense = await ExpenseClaim.findByIdAndUpdate(
        expenseId,
        { 
          status: 'Paid',
          paymentReference: `TXN-${razorpay_payment_id || crypto.randomBytes(4).toString('hex').toUpperCase()}`
        },
        { new: true }
      );
      res.json({ success: true, expense: updatedExpense });
    } else {
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
