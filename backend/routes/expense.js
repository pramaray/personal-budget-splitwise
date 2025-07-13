const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
  getBalances,
  getExpensesByGroup
} = require('../controllers/expenseController');

router.route('/')
  .post(protect, createExpense)
  .get(protect, getExpenses);

router.route('/:id')
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

router.route('/balances')
  .get(protect, getBalances);

router.get('/group/:id', protect, getExpensesByGroup);


module.exports = router;
