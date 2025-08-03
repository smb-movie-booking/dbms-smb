const otpModel = require('../models/otpModel');
const userModel = require('../models/userModel')

exports.sendOTP = (req, res) => {
  const identifier = req.body.identifier?.trim();

  if (!identifier) return res.status(400).json({ message: 'Identifier required' });

  const phoneRegex = /^[6-9]\d{9}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isPhone = phoneRegex.test(identifier);
  const isEmail = emailRegex.test(identifier);

  if (!isPhone && !isEmail) {
    return res.status(400).json({ message: 'Invalid phone or email format' });
  }

  const checkUser = isPhone ? userModel.findByPhone : userModel.getByEmail;

  checkUser(identifier, (err, user) => {
    if (err) return res.status(500).json({ message: 'DB error' });

    if (user && req.session?.user && user.UserID !== req.session.user.id) {
      return res.status(409).json({ message: `${isPhone ? 'Phone' : 'Email'} already registered by another user` });
    }

    if (user && req.session?.user && user.UserID === req.session.user.id) {
      return res.status(400).json({ message: `This is already your current ${isPhone ? 'phone' : 'email'}` });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5);
    const expiresAt = now.toLocaleString('sv-SE', { hour12: false }).replace('T', ' ');

    otpModel.createOrUpdateOTP(identifier, otp, expiresAt, (err) => {
      if (err) return res.status(500).json({ message: 'Error storing OTP' });

      console.log(`📲 OTP for ${identifier}: ${otp}`);
      return res.status(200).json({ message: `OTP sent to ${isPhone ? 'phone' : 'email'} (console)` });
    });
  });
};



exports.verifyOTP = (req, res) => {
  const identifier = req.body.identifier?.trim();
  const otp = req.body.otp?.trim();

  if (!identifier || !otp) {
    return res.status(400).json({ message: 'Identifier and OTP required' });
  }

  otpModel.getOTP(identifier, (err, record) => {
    if (err || !record) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    if (record.OTP_Code !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    otpModel.markAsVerified(identifier, (err) => {
      if (err) return res.status(500).json({ message: 'Error marking verified' });
      return res.status(200).json({ message: 'OTP verified successfully' });
    });
  });
};

