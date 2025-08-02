const userModel = require('../models/userModel');

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

  const { name, phone } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });

  userModel.updateUser(userId, name, phone, (err, result) => {
    if (err) return res.status(500).json({ error: 'Update failed' });

    // Update session info too
    req.session.user.name = name;
    res.json({ message: 'Profile updated successfully' });
  });
};
