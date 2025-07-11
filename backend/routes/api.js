// routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Test route
router.get('/ping', apiController.ping);

// Healthcheck route
router.get('/health', apiController.health);

module.exports = router;

