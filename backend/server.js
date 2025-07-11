const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());

// Test routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const budgetRoutes = require('./routes/budget');
app.use('/api/budgets', budgetRoutes);

const groupRoutes = require('./routes/group');
app.use('/api/groups', groupRoutes);

//console.log('MONGO_URI:', process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
