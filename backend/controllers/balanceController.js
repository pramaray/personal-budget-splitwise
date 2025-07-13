const Expense = require("../models/expense");
const Group = require("../models/group");

// ✅ Get balances for a specific group
exports.getGroupBalances = async (req, res) => {
  try {
    const groupId = req.params.id;

    // Fetch group & validate
    const group = await Group.findById(groupId).populate("members", "name email");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Fetch all expenses for this group
    const expenses = await Expense.find({ group: groupId });

    // Initialize balances map
    const balances = {};
    group.members.forEach((member) => {
      balances[member._id] = { user: member, balance: 0 };// Replace balances[member._id] = ...
    //balances[String(member._id)] = { user: member, balance: 0 };

    });

    // Calculate balances from expenses
    expenses.forEach((expense) => {
      const share = expense.amount / expense.splitBetween.length;

      expense.splitBetween.forEach((participantId) => {
        if (participantId.toString() !== expense.paidBy.toString()) {
          balances[participantId].balance -= share;
          balances[expense.paidBy].balance += share;
        }
      });
    });

    res.status(200).json(Object.values(balances));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
