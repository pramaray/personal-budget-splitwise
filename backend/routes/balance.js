const express = require("express");
const router = express.Router();
const { getGroupBalances } = require("../controllers/balanceController");
const { protect } = require("../middleware/authMiddleware");

// ✅ GET /api/balances/group/:id
router.get("/group/:id", protect, getGroupBalances);

module.exports = router;
