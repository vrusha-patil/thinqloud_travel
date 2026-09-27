const express = require('express');
const router = express.Router();
const { 
  submitExpenseClaim,
  getPendingExpenses,
  getPendingExpensesForManager,
  verifyExpense,
  markAsPaid
} = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, submitExpenseClaim);
router.get('/pending-manager', protect, authorize('manager', 'admin'), getPendingExpensesForManager);
router.patch('/:id/verify', protect, authorize('manager', 'admin'), verifyExpense);
router.get('/pending', protect, authorize('finance', 'admin'), getPendingExpenses);
router.patch('/:id/pay', protect, authorize('finance', 'admin'), markAsPaid);

module.exports = router;
