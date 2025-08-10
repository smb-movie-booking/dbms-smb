const userModel = require('../models/userModel');
const otpModel = require('../models/otpModel');
const bcrypt = require('bcrypt');

// GET /users/me
exports.getProfile = (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  return res.json({ user });
};

// PUT /users/update-password
exports.updatePassword = (req, res) => {
  const userId = req.session.user?.id;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!userId || !currentPassword || !newPassword || !confirmPassword)
    return res.status(400).json({ error: 'All fields required' });

  if (newPassword !== confirmPassword)
    return res.status(400).json({ error: 'Passwords do not match' });

  userModel.getPasswordById(userId, (err, user) => {
    if (err || !user) return res.status(500).json({ error: 'User not found' });

    bcrypt.compare(currentPassword, user.User_Password, (err, match) => {
      if (err || !match)
        return res.status(401).json({ error: 'Incorrect current password' });

      bcrypt.hash(newPassword, 10, (err, hashedPwd) => {
        if (err) return res.status(500).json({ error: 'Hashing failed' });

        userModel.updatePassword(userId, hashedPwd, (err) => {
          if (err) return res.status(500).json({ error: 'Update failed' });
          res.json({ message: 'Password updated successfully' });
        });
      });
    });
  });
};

// PUT /users/update-name
exports.updateName = (req, res) => {
  const userId = req.session.user?.id;
  const name = req.body.name?.trim();

  if (!userId || !name) return res.status(400).json({ error: 'Name required' });

  userModel.updateName(userId, name, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update name' });
    req.session.user.name = name;
    res.json({ message: 'Name updated successfully' });
  });
};

// PUT /users/update-phone
exports.updatePhone = (req, res) => {
  const userId = req.session.user?.id;
  const phone = req.body.phone?.trim();
  const otp = req.body.otp?.trim();

  if (!userId || !phone || !otp)
    return res.status(400).json({ error: 'Phone and OTP are required' });

  // Get OTP that is not expired and not yet verified
  otpModel.getOTP(phone, (err, record) => {
    if (err || !record)
      return res.status(400).json({ error: 'OTP not found or expired' });

    if (record.OTP_Code !== otp)
      return res.status(401).json({ error: 'Invalid OTP' });

    // Mark OTP as verified (optional, but good for audit/logging)
    otpModel.markAsVerified(phone, (err) => {
      if (err) console.error('Warning: failed to mark OTP as verified');

      userModel.findByPhone(phone, (err, existingUser) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (existingUser && existingUser.UserID !== userId)
          return res.status(409).json({ error: 'Phone already in use' });

        userModel.updatePhone(userId, phone, (err) => {
          if (err) return res.status(500).json({ error: 'Failed to update phone' });

          req.session.user.phone = phone;
          otpModel.deleteOTP(phone, () => {}); // Clean up OTP

          res.json({ message: 'Phone number verified and updated successfully' });
        });
      });
    });
  });
};


exports.updateEmail = (req, res) => {
  const userId = req.session.user?.id;
  const email = req.body.email?.trim();
  const otp = req.body.otp?.trim();

  if (!userId || !email || !otp)
    return res.status(400).json({ error: 'Email and OTP required' });

  otpModel.getOTP(email, (err, record) => {
    if (err || !record)
      return res.status(400).json({ error: 'OTP not found or expired' });

    if (record.OTP_Code !== otp)
      return res.status(401).json({ error: 'Invalid OTP' });

    otpModel.markAsVerified(email, (err) => {
      if (err) console.error('Warning: failed to mark OTP as verified');

      userModel.getByEmail(email, (err, existingUser) => {
        if (err) return res.status(500).json({ error: 'DB error' });

        if (existingUser && existingUser.UserID !== userId)
          return res.status(409).json({ error: 'Email already in use' });

        userModel.updateEmail(userId, email, (err) => {
          if (err) return res.status(500).json({ error: 'Failed to update email' });

          req.session.user.email = email;
          otpModel.deleteOTP(email, () => {}); // Cleanup

          res.json({ message: 'Email updated successfully' });
        });
      });
    });
  });
};


exports.updateProfile=(req,res)=>{
  try {
    const userId=req.session.user?.id;
    const {name,email,phone}=req.body;
    console.log(req.body);

    if(!name.trim() || (!phone && !email)){
      return res.status(401).json({message:"phone and email both cannot be empty"});
    }

    userModel.updateUser(userId, name, phone, email,(err,result)=>{
      if(err){
        return res.status(500).json({success:false,error:err.message})
      }

      req.session.user.name = name;
      req.session.user.phone = phone;
      req.session.user.email = email;
      return res.status(200).json({success:true,message:"Profile Updated Successfullt"});
    })
  } catch (error) {
    return  res.status(500).json({error:error.message})
  }
  
}

// DELETE /users/me
exports.deleteProfile = (req, res) => {
  const userId = req.session.user?.id;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  userModel.deleteUserById(userId, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to delete profile' });

    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ success:true,message: 'Profile deleted successfully' });
    });
  });
};


