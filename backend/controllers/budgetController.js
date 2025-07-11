const Budget = require('../models/budget');

// Create Budget
exports.createBudget = async (req, res) => {
    const { name, amount, category } = req.body;
    if (!name || !amount || !category) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const budget = await Budget.create({ name, amount, category, user: req.user.id });
        res.status(201).json(budget);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get All Budgets for Logged-in User
exports.getBudgets = async (req, res) => {
    try {
        const budgets = await Budget.find({ user: req.user.id });
        res.status(200).json(budgets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update Budget
exports.updateBudget = async (req, res) => {
    try {
        const budget = await Budget.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!budget) return res.status(404).json({ message: "Budget not found" });
        res.status(200).json(budget);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Delete Budget
exports.deleteBudget = async (req, res) => {
    try {
        const budget = await Budget.findByIdAndDelete(req.params.id);
        if (!budget) return res.status(404).json({ message: "Budget not found" });
        res.status(200).json({ message: "Budget deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
