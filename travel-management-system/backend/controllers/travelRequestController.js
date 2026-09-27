const TravelRequest = require('../models/TravelRequest');

// @desc    Create a new travel request
// @route   POST /api/travel-requests
// @access  Private (Employee)
const createTravelRequest = async (req, res) => {
  try {
    const { destination, purpose, startDate, endDate, travelMode, estimatedCosts } = req.body;

    // BR-1 Date Integrity check
    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    // Generate a unique Request ID
    const count = await TravelRequest.countDocuments();
    const requestId = `TR-${(count + 1).toString().padStart(3, '0')}`;

    const request = new TravelRequest({
      requestId,
      employeeId: req.user._id,
      destination,
      purpose,
      startDate,
      endDate,
      travelMode,
      estimatedCosts,
      status: 'Pending Approval'
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    console.error('ERROR in createTravelRequest:', error.stack);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in employee's travel requests
// @route   GET /api/travel-requests/my-requests
// @access  Private (Employee)
const getMyRequests = async (req, res) => {
  try {
    const requests = await TravelRequest.find({ employeeId: req.user._id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all pending requests (Manager Dashboard)
// @route   GET /api/travel-requests/pending
// @access  Private (Manager)
const getPendingRequests = async (req, res) => {
  try {
    // In a real app, you might filter by req.user.department
    const requests = await TravelRequest.find({ status: 'Pending Approval' })
      .populate('employeeId', 'name email department')
      .sort({ createdAt: 1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update request status (Approve/Reject)
// @route   PATCH /api/travel-requests/:id/status
// @access  Private (Manager)
const updateRequestStatus = async (req, res) => {
  try {
    const { status, managerComment } = req.body;
    
    // BR-6 Mandatory Justification for Rejection
    if (status === 'Rejected' && !managerComment) {
      return res.status(400).json({ message: 'A rejection reason must be provided.' });
    }

    const request = await TravelRequest.findById(req.params.id);

    if (request) {
      request.status = status;
      if (managerComment) request.managerComment = managerComment;
      
      const updatedRequest = await request.save();
      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Travel request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTravelRequest,
  getMyRequests,
  getPendingRequests,
  updateRequestStatus
};
