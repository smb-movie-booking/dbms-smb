const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel');

const bcrypt = require('bcrypt');

exports.changePassword = (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const { currentPassword, newPassword, phone, otp } = req.body;

  if (!currentPassword || !newPassword || !phone || !otp) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  // Step 1: OTP verification
  otpModel.getOTP(phone, (err, record) => {
    if (err || !record) return res.status(400).json({ error: 'OTP not found' });
    if (!record.Verified) return res.status(401).json({ error: 'OTP not verified' });

    // Step 2: Get user
    userModel.getUserById(userId, (err, user) => {
      if (err || !user) return res.status(404).json({ error: 'User not found' });

      // Step 3: Compare current password
      bcrypt.compare(currentPassword, user.User_Password, (err, isMatch) => {
        if (err || !isMatch) return res.status(401).json({ error: 'Incorrect current password' });

        // Step 4: Hash new password
        bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
          if (err) return res.status(500).json({ error: 'Error hashing password' });

          // Step 5: Update in DB
          userModel.updatePassword(userId, hashedPassword, (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update password' });

            // Clear OTP optionally
            otpModel.deleteOTP(phone, () => {
              return res.json({ message: 'Password changed successfully' });
            });
          });
        });
      });
    });
  });
};


// GET /users/me
exports.getProfile = (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  userModel.getUserById(userId, (err, user) => {
    if (err || !user) return res.status(500).json({ error: 'Failed to fetch profile' });
    res.json(user);
  });
};

// PUT /users/me
exports.updateProfile = (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const name = req.body.name?.trim();
  const phone = req.body.phone?.trim();
  const email = req.body.email?.trim();
  const otp = req.body.otp?.trim();

  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Name, phone, and email are required' });
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Step 1: Verify OTP
  otpModel.getOTP(phone, (err, record) => {
    if (err || !record) return res.status(400).json({ error: 'OTP not found' });
    if (!record.Verified) return res.status(401).json({ error: 'Phone not verified via OTP' });

    // Step 2: Check if phone or email already used by someone else
    userModel.findByEmailOrPhone(email, phone, (err, existingUser) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (existingUser && existingUser.UserID !== userId) {
        return res.status(409).json({ error: 'Email or phone already in use' });
      }

      // Step 3: Update user in DB
      userModel.updateUser(userId, name, phone, email, (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to update profile' });

        // Step 4: Update session info
        req.session.user.name = name;
        req.session.user.phone = phone;
        req.session.user.email = email;

        // Optional: clear OTP entry
        otpModel.deleteOTP(phone, () => {
          return res.json({ message: 'Profile updated successfully' });
        });
      });
    });
  });
};


// DELETE /users/me
exports.deleteProfile = (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  userModel.deleteUserById(userId, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete profile' });

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ message: 'Profile deleted successfully' });
    });
  });
};


