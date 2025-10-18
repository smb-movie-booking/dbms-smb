const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel');
const bcrypt = require('bcrypt');
const session = require('express-session');
require('dotenv').config();

exports.login = (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Email/Phone and password are required' });
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleUser = (err, user) => {
    if (err || !user) {
      return res.status(401).json({ message: 'User not found' });
    }

    bcrypt.compare(password, user.User_Password, (err, isMatch) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      req.session.user = {
        id: user.UserID,
        name: user.User_Name,
        email: user.Email,
        phone: user.Phone,
        isAdmin: user.IsAdmin === 1
      };

      // Save session and respond ONLY once
      req.session.save((err) => {
        if (err) {
          console.error('Session save failed:', err);
          return res.status(500).json({ message: 'Session save failed' });
        }

        return res.status(200).json({
          success: true,
          message: user.IsAdmin === 1 ? 'Admin logged in successfully' : 'User logged in successfully'
        });
      });
    });
  };

  if (phoneRegex.test(identifier)) {
    userModel.findByPhone(identifier, handleUser);
  } else if (emailRegex.test(identifier)) {
    userModel.getByEmail(identifier, handleUser);
  } else {
    return res.status(400).json({ message: 'Invalid email or phone format' });
  }
};




exports.register = (req, res) => {
  let { name, phone, password, adminCode } = req.body;
  name = name?.trim();

  if (!name || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Step 1: Check if phone is verified
  otpModel.isVerified(phone, (err, isVerified) => {
    const isAdmin = adminCode === process.env.ADMIN_SECRET ? 1 : 0;
    if (!isAdmin) {
      if (err) return res.status(500).json({ message: 'Verification check failed' });
      if (!isVerified) return res.status(403).json({ message: 'Phone not verified via OTP' });
    }

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
  const { phone, email, otp, newPassword } = req.body;
  //console.log(req.body);
  if (!phone || !otp || !newPassword) {
    return res.status(400).json({ message: 'Phone or email, OTP, and new password are required' });
  }

  const isPhone = !!phone;
  const identifier = phone || email;
  console.log(identifier);
  // Validate identifier format
  if (isPhone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(identifier)) {
      return res.status(400).json({ message: 'Invalid phone number format' });
    }
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(identifier)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
  }

  // Fetch valid OTP (expiration already handled in getOTP)
  otpModel.getVerifiedOTP(identifier, (err, record) => {
    console.log(record);
    if (err || !record) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    if (record.OTP_Code !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    // Hash and update new password
    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: 'Password hashing failed' });
      }

      const updateFn = isPhone
        ? userModel.updatePasswordByPhone
        : userModel.updatePasswordByEmail;

      updateFn(identifier, hashedPassword, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Failed to update password' });
        }

        otpModel.deleteOTP(identifier, () => {
          return res.status(200).json({ message: 'Password reset successfully' });
        });
      });
    });
  });
};

