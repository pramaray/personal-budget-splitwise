const Expense = require('../models/expense');

// Create a new expense
exports.createExpense = async (req, res) => {
  const { description, amount, paidBy, splitBetween, group } = req.body;
  if (!description || !amount || !paidBy || !splitBetween.length) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const expense = await Expense.create({
      description,
      amount,
      paidBy,
      splitBetween,
      group
    });
    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// Get all expenses where user is involved
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      $or: [
        { paidBy: req.user.id },
        { splitBetween: req.user.id }
      ]
    }).populate('paidBy splitBetween group', 'name email');
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Calculate balances for the logged-in user
exports.getBalances = async (req, res) => {
  try {
    const expenses = await Expense.find({
      $or: [
        { paidBy: req.user.id },
        { splitBetween: req.user.id }
      ]
    }).populate('paidBy splitBetween', 'name email');

    let balances = {}; // { userId: netAmount }

    expenses.forEach(exp => {
      const share = exp.amount / exp.splitBetween.length;

      exp.splitBetween.forEach(user => {
        const userId = user._id.toString();
        const paidById = exp.paidBy._id.toString();

        if (userId !== paidById) {
          // User owes share
          balances[userId] = (balances[userId] || 0) - share;
          balances[paidById] = (balances[paidById] || 0) + share;
        }
      });
    });

    res.json(balances);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
// @desc    Get all expenses for a specific group
// @route   GET /api/expenses/group/:id
// @access  Private
exports.getExpensesByGroup = async (req, res) => {
  try {
    const expenses = await Expense.find({ group: req.params.id })
      .populate("paidBy", "name email")
      .populate("splitBetween", "name email");
    res.json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};
