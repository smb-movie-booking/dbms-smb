const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const session = require('express-session');

// POST /login
exports.login = (req, res) => {
  const { email, password } = req.body;

  userModel.getByEmail(email, (err, user) => {
    if (err || !user) return res.status(401).send('Invalid email or password');

    bcrypt.compare(password, user.User_Password, (err, result) => {
      if (err || !result) return res.status(401).send('Invalid credentials');

        req.session.user = {
            id: user.UserID,
            name: user.User_Name,
            email: user.Email,
            isAdmin: user.IsAdmin === 1
        };

      res.status(200).send('Login successful');
    });
  });
};

// POST /register
exports.register = (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Step 1: Check if user already exists
  userModel.getByEmail(email, (err, existingUser) => {
    if (err) {
      console.error('❌ DB error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists. Please log in instead.' });
    }

    // Step 2: Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error('❌ Hashing error:', err);
        return res.status(500).json({ message: 'Error encrypting password' });
      }

      // Step 3: Create the user
      userModel.createUser(name, hashedPassword, email, phone, (err, result) => {
        if (err) {
          console.error('❌ Error creating user:', err);
          return res.status(500).json({ message: 'Database error during user creation' });
        }

        // Step 4: Fetch user & set session
        userModel.getByEmail(email, (err, user) => {
          if (err || !user) {
            return res.status(500).json({ message: 'Error fetching user after registration' });
          }

          // Auto-login (set session)
          req.session.user = {
            id: user.UserID,
            name: user.User_Name,
            email: user.Email,
            isAdmin: user.IsAdmin === 1
          };

          return res.status(201).json({ message: 'User registered & logged in successfully' });
        });
      });
    });
  });
};


// GET /logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send('Error logging out');
    res.clearCookie('connect.sid');
    res.send('Logged out');
  });
};