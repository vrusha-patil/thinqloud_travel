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

const getAllExpensesForManager = async (req, res) => {
  try {
    const claims = await ExpenseClaim.find({})
      .populate('employeeId', 'name')
      .populate('requestId', 'requestId destination')
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllExpensesForFinance = async (req, res) => {
  try {
    const claims = await ExpenseClaim.find({})
      .populate('employeeId', 'name')
      .populate('requestId', 'requestId destination')
      .sort({ createdAt: -1 });
    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const nodemailer = require('nodemailer');

const markAsPaid = async (req, res) => {
  try {
    const { financeComment, paymentId } = req.body;
    
    const claim = await ExpenseClaim.findById(req.params.id).populate('employeeId', 'name email');

    if (claim) {
      claim.status = 'Paid';
      if (financeComment) claim.financeComment = financeComment;
      if (paymentId) claim.paymentReference = paymentId;
      
      const updatedClaim = await claim.save();

      // Mark the travel request as completed once paid
      const travelReq = await TravelRequest.findById(claim.requestId);
      if(travelReq) {
        travelReq.status = 'Completed';
        await travelReq.save();
      }

      // Send email receipt
      if (process.env.EMAIL_PASS) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER || 'pvrushali9067@gmail.com',
            pass: process.env.EMAIL_PASS
          }
        });

        const mailOptions = {
          from: process.env.EMAIL_USER || 'pvrushali9067@gmail.com',
          to: claim.employeeId.email,
          subject: `TripFlow - Payment Receipt for Claim ${claim.claimId}`,
          html: `
            <h2>Payment Successful!</h2>
            <p>Hello ${claim.employeeId.name},</p>
            <p>Your expense claim <b>${claim.claimId}</b> has been successfully reimbursed.</p>
            <table style="border-collapse: collapse; width: 100%; max-width: 500px;">
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><b>Total Amount:</b></td><td style="padding: 8px; border: 1px solid #ddd;">₹${claim.totalAmount}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><b>Payment Ref ID:</b></td><td style="padding: 8px; border: 1px solid #ddd;">${paymentId || 'N/A'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><b>Date & Time:</b></td><td style="padding: 8px; border: 1px solid #ddd;">${new Date().toLocaleString()}</td></tr>
            </table>
            <br>
            <p>Regards,<br>TripFlow Finance Team</p>
          `
        };

        transporter.sendMail(mailOptions).catch(err => console.error('Failed to send receipt email', err));
      } else {
        console.log('No EMAIL_PASS found in .env. Cannot send receipt email. Details:', {
          to: claim.employeeId.email,
          amount: claim.totalAmount,
          paymentId: paymentId
        });
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
  markAsPaid, 
  getAllExpensesForManager, 
  getAllExpensesForFinance
};



