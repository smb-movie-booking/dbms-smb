const otpModel = require('../models/otpModel');

exports.sendOTP = (req, res) => {
  const phone = req.body.phone?.trim();

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Invalid phone number format' });
  }

  userModel.findByPhone(phone, (err, user) => {
    if (err) return res.status(500).json({ message: 'DB error' });
    if (user) return res.status(409).json({ message: 'Phone already registered' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

    otpModel.createOrUpdateOTP(phone, otp, expiresAt, (err) => {
      if (err) return res.status(500).json({ message: 'Error storing OTP' });

      console.log(`📲 OTP for ${phone}: ${otp}`);
      return res.status(200).json({ message: 'OTP sent to phone (console)' });
    });
  });
};

exports.verifyOTP = (req, res) => {
  const phone = req.body.phone?.trim();
    const otp = req.body.otp?.trim();


  otpModel.getOTP(phone, (err, record) => {
    if (err || !record) {
      return res.status(400).json({ message: 'OTP not found' });
    }

    if (record.Verified) {
      return res.status(400).json({ message: 'Already verified' });
    }

    if (record.OTP_Code !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    if (new Date() > record.Expires_At) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    otpModel.markVerified(phone, (err) => {
      if (err) return res.status(500).json({ message: 'Error marking verified' });
      return res.status(200).json({ message: 'OTP verified successfully' });
    });
  });
};
