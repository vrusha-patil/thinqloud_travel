const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Policy = require('../models/Policy');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get all users
router.get('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const nodemailer = require('nodemailer');

// Store OTPs temporarily (in memory for demo, use DB/Redis in prod)
const otpStore = {};

// Send OTP
router.post('/users/send-otp', protect, authorize('admin'), async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  
  // Generate a 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[email] = otp;
  
  try {
    // Configure NodeMailer to use standard Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'pvrushali9067@gmail.com', // Use env var or default to the user's email
        pass: process.env.EMAIL_PASS || 'your_app_password_here' // Needs 16-character App Password if 2FA is on
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'pvrushali9067@gmail.com',
      to: email, // Sending to the email provided in the form
      subject: 'TripFlow - Admin Verification OTP',
      text: `Hello, you are being added to TripFlow. Your verification OTP is: ${otp}`
    };

    if (process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      res.json({ message: 'Real OTP sent to email successfully.' });
    } else {
      console.log(`[DEV MODE - NO EMAIL_PASS SET] OTP for ${email} is ${otp}`);
      res.json({ message: 'OTP sent in DEV mode (Check server console). Please set EMAIL_PASS in backend .env to send real emails.' });
    }
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send real OTP email. Check Gmail App Password settings.' });
  }
});

// Verify OTP separately
router.post('/users/verify-otp', protect, authorize('admin'), async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });
  
  if (otpStore[email] && otpStore[email] === otp) {
    res.json({ message: 'OTP Verified Successfully' });
  } else {
    res.status(400).json({ error: 'Invalid or expired OTP. Please try again.' });
  }
});

// Create user
router.post('/users', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, password, role, department, customId, address, joiningDate, otp } = req.body;
    
    // Verify OTP
    if (!otpStore[email] || otpStore[email] !== otp) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }
    
    const user = new User({ name, email, password, role, department, customId, address, joiningDate });
    await user.save();
    
    // Clear OTP
    delete otpStore[email];
    
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user (Admin can change email, role, etc)
router.put('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const { name, email, role, department, customId, address, joiningDate } = req.body;
    const user = await User.findById(req.user.id);
    
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { name, email, role, department, customId, address, joiningDate },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete (or Deactivate) user
router.delete('/users/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const TravelRequest = require('../models/TravelRequest');

// Get all trips
router.get('/trips', protect, authorize('admin'), async (req, res) => {
  try {
    const trips = await TravelRequest.find()
      .populate('employeeId', 'name email department customId')
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

