const express = require('express');
const router = express.Router();
const { 
  submitExpenseClaim,
  getPendingExpenses,
  getPendingExpensesForManager,
  verifyExpense,
  markAsPaid, 
  getAllExpensesForManager, 
  getAllExpensesForFinance
} = require('../controllers/expenseController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, submitExpenseClaim);
router.get('/pending-manager', protect, authorize('manager', 'admin'), getPendingExpensesForManager);
router.get('/manager-all', protect, authorize('manager', 'admin'), getAllExpensesForManager);
router.patch('/:id/verify', protect, authorize('manager', 'admin'), verifyExpense);
router.get('/pending', protect, authorize('finance', 'admin'), getPendingExpenses);
router.get('/finance-all', protect, authorize('finance', 'admin'), getAllExpensesForFinance);
router.patch('/:id/pay', protect, authorize('finance', 'admin'), markAsPaid);

module.exports = router;

