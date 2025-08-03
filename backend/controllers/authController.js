const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel');
const bcrypt = require('bcrypt');
const session = require('express-session');
require('dotenv').config();

// POST /login
exports.login = (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ message: 'Phone number and password are required' });
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }

  userModel.findByPhone(phone, (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    bcrypt.compare(password, user.User_Password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      req.session.user = {
        id: user.UserID,
        name: user.User_Name,
        email: user.Email,
        phone: user.Phone,
        isAdmin: user.IsAdmin === 1
      };

      return res.status(200).json({
        message: user.IsAdmin === 1 ? 'Admin logged in successfully' : 'User logged in successfully'
      });
    });
  });
};


exports.register = (req, res) => {
  let { name, phone, password, adminCode } = req.body;
  name = name?.trim();

  if (!name || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Step 1: Check if phone is verified
  otpModel.isVerified(phone, (err, isVerified) => {
    if (err) return res.status(500).json({ message: 'Verification check failed' });
    if (!isVerified) return res.status(403).json({ message: 'Phone not verified via OTP' });

    const isAdmin = adminCode === process.env.ADMIN_SECRET ? 1 : 0;

    // Step 2: Hash password and create user
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: 'Hashing error' });

      userModel.createUser(name, hashedPassword, null, phone, isAdmin, (err) => {
        if (err) return res.status(500).json({ message: 'User creation error' });

        // Step 3: Delete OTP entry
        otpModel.deleteOTP(phone, () => {}); // optional callback

        // Step 4: Auto-login the user
        userModel.findByPhone(phone, (err, user) => {
          if (err || !user) return res.status(500).json({ message: 'Fetch failed' });

          req.session.user = {
            id: user.UserID,
            name: user.User_Name,
            email: user.Email,
            phone: user.Phone,
            isAdmin: user.IsAdmin === 1
          };

          return res.status(201).json({
            message: isAdmin ? 'Admin registered & logged in' : 'User registered & logged in'
          });
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

exports.resetPassword = (req, res) => {
  const { phone, otp, newPassword } = req.body;

  if (!phone || !otp || !newPassword) {
    return res.status(400).json({ message: 'Phone, OTP, and new password are required' });
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }

  otpModel.getOTP(phone, (err, record) => {
    if (err || !record) return res.status(400).json({ message: 'OTP not found' });
    if (record.OTP_Code !== otp) return res.status(401).json({ message: 'Invalid OTP' });
    if (new Date() > record.Expires_At) return res.status(400).json({ message: 'OTP expired' });

    // Hash new password
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: 'Hashing error' });

      // Update password
      userModel.updatePasswordByPhone(phone, hashedPassword, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error updating password' });

        // Optionally mark OTP as verified or delete it
        otpModel.deleteOTP(phone, () => {
          return res.status(200).json({ message: 'Password reset successfully' });
        });
      });
    });
  });
};
