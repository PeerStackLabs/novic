require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initGoogleSheets } = require('./config/googleAuth');
const { startVerificationCron } = require('./cron/verifyCron');

// Import routes
const authRoutes = require('./routes/auth');
const donationRoutes = require('./routes/donations');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Initialize Google Sheets API
initGoogleSheets();

// Start verification cron job
startVerificationCron();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Novic Foundation API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   - POST   /api/auth/signup`);
  console.log(`   - POST   /api/auth/login`);
  console.log(`   - GET    /api/auth/me`);
  console.log(`   - POST   /api/donations`);
  console.log(`   - GET    /api/donations`);
  console.log(`   - GET    /api/donations/:id`);
});
