const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Get token after 'Bearer'

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to request (without password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Go to next middleware/controller
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

//module.exports = {protect};
