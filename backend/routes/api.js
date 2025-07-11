const express = require('express');
const router = express.Router();

// test route
router.get('/ping', (req, res) => {
  res.json({ message: 'pong 🎯' });
});

// healthcheck route
router.get('/health', (req, res) => {
  res.json({ db: 'connected' });
});

module.exports = router;
