const express = require('express');
require('dotenv').config();

const session = require('express-session');
const cors=require('cors')
const { db , sessionStore } = require('./config/db');

const movieRoutes = require('./routes/movies');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const showRoutes = require('./routes/show');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payment');
const theaterRoutes = require('./routes/theater'); 
const seatRoutes=require('./routes/seat')
const { startCleanupJob } = require('./utils/cleanupService');

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60
  }
}));

console.log(process.env.DB_USER);

app.use(cors({
  origin:[
    'http://localhost:5173', // Your local React app
    'https://dbms-smb.vercel.app/' // 👈 ADD YOUR LIVE URL HERE (you'll get this in Step 3)
  ],
  credentials:true,
}))

app.use(express.json());
app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/seat',seatRoutes);

startCleanupJob();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
