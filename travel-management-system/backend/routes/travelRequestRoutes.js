const express = require('express');
const router = express.Router();
const { 
  createTravelRequest, 
  getMyRequests, 
  getPendingRequests, 
  getManagerRequests, 
  updateRequestStatus 
} = require('../controllers/travelRequestController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createTravelRequest);

router.get('/my-requests', protect, getMyRequests);
router.get('/pending', protect, authorize('manager', 'admin'), getPendingRequests);
router.get('/manager-all', protect, authorize('manager', 'admin'), getManagerRequests);
router.patch('/:id/status', protect, authorize('manager', 'admin'), updateRequestStatus);

module.exports = router;

