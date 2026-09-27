const express = require('express');
const router = express.Router();
const { 
  createTravelRequest, 
  getMyRequests, 
  getPendingRequests, 
  updateRequestStatus 
} = require('../controllers/travelRequestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createTravelRequest);

router.get('/my-requests', protect, getMyRequests);
router.get('/pending', protect, authorize('manager', 'admin'), getPendingRequests);
router.patch('/:id/status', protect, authorize('manager', 'admin'), updateRequestStatus);

module.exports = router;
