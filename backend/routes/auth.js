const express = require('express');
const router = express.Router();
const { register, login, getMe,getUserByEmail } = require('../controllers/authController');
const {protect} = require('../middleware/authMiddleware');
// Register
router.post('/register', register);

// Login
router.post('/login', login);

//CurrentUser
router.get('/me', protect, getMe); 

//user using email
router.get('/user-by-email', protect, getUserByEmail);

module.exports = router;
