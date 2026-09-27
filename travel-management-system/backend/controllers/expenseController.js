const ExpenseClaim = require('../models/ExpenseClaim');
const TravelRequest = require('../models/TravelRequest');

const submitExpenseClaim = async (req, res) => {
  try {
    const { requestId, items } = req.body;

    const travelReq = await TravelRequest.findById(requestId);
    if (!travelReq) {
      return res.status(404).json({ message: 'Travel request not found' });
    }

    if (travelReq.status !== 'Approved' && travelReq.status !== 'Completed') {
      return res.status(400).json({ message: 'Expenses can only be submitted for Approved or Completed trips.' });
    }

    const count = await ExpenseClaim.countDocuments();
    const claimId = `CLM-${(count + 1).toString().padStart(3, '0')}`;

    const claim = new ExpenseClaim({
      claimId,
      employeeId: req.user._id,
      requestId,
      items,
      status: 'Pending'
    });

    const createdClaim = await claim.save();
    res.status(201).json(createdClaim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingExpensesForManager = async (req, res) => {
  try {
    const claims = await ExpenseClaim.find({ status: 'Pending' })
      .populate('employeeId', 'name')
      .populate('requestId', 'requestId destination')
      .sort({ createdAt: 1 });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyExpense = async (req, res) => {
  try {
    const claim = await ExpenseClaim.findById(req.params.id);
    if (!claim) return res.status(404).json({ message: 'Expense claim not found' });

    claim.status = 'Verified';
    await claim.save();
    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPendingExpenses = async (req, res) => {
  try {
    // Finance sees verified claims
    const claims = await ExpenseClaim.find({ status: 'Verified' })
      .populate('employeeId', 'name')
      .populate('requestId', 'requestId destination')
      .sort({ createdAt: 1 });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsPaid = async (req, res) => {
  try {
    const { financeComment } = req.body;
    
    const claim = await ExpenseClaim.findById(req.params.id);

    if (claim) {
      claim.status = 'Paid';
      if (financeComment) claim.financeComment = financeComment;
      
      const updatedClaim = await claim.save();

      // Mark the travel request as completed once paid
      const travelReq = await TravelRequest.findById(claim.requestId);
      if(travelReq) {
        travelReq.status = 'Completed';
        await travelReq.save();
      }

      res.json(updatedClaim);
    } else {
      res.status(404).json({ message: 'Expense claim not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitExpenseClaim,
  getPendingExpensesForManager,
  verifyExpense,
  getPendingExpenses,
  markAsPaid
};
