const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // 👉 Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword
    });
    await user.save();

    // Return JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // 👉 Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });
    
    res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// Get user by email
exports.getUserByEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: "Email is required" });
  const user = await User.findOne({ email }).select('_id name email');
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};
