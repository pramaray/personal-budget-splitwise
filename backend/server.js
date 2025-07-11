const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();


const app = express();
app.use(express.json());

// Test routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

//console.log('MONGO_URI:', process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
