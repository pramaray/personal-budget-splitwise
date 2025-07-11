const express = require('express');
const router = express.Router();
const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

// Debug logs
console.log('createBudget:', typeof createBudget);
console.log('protect:', typeof protect);

router.route('/')
  .post(protect, createBudget)
  .get(protect, getBudgets);

router.route('/:id')
  .put(protect, updateBudget)
  .delete(protect, deleteBudget);

module.exports = router;
