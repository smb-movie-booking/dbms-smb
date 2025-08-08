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
  origin:"http://localhost:5173",
  credentials:true,
}))

app.use(express.json());
app.use('/api/movies', movieRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shows', showRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
