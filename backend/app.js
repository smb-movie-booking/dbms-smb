const express = require('express');
require('dotenv').config();
const session = require('express-session');
const cors = require('cors');
const { db, sessionStore } = require('./config/db');

const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const showRoutes = require('./routes/show');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payment');
const theaterRoutes = require('./routes/theater');
const seatRoutes = require('./routes/seat');
const { startCleanupJob } = require('./utils/cleanupService');

const app = express();

// ✅ Define this before session & CORS
const isProduction = process.env.NODE_ENV === 'production';

// ✅ CORS setup (must come BEFORE routes and session if using credentials)
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://dbms-smb.vercel.app'
  ],
  credentials: true,
}));

// ✅ Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure: isProduction,                    // must be true on HTTPS (Render)
    sameSite: isProduction ? 'None' : 'Lax', // allow cross-site cookies
    maxAge: 1000 * 60 * 60,                  // 1 hour
  },
}));

app.use(express.json());

app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/seat', seatRoutes);

startCleanupJob();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
