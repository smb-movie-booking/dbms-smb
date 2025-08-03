const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isAuthenticated = require('../middlewares/isAuthenticated');

// Get current user profile
router.get('/me', isAuthenticated, userController.getProfile);

// Update name
router.put('/update-name', isAuthenticated, userController.updateName);

// Update phone number (with OTP verification)
router.put('/update-phone', isAuthenticated, userController.updatePhone);

// Update email (with OTP verification)
router.put('/update-email', isAuthenticated, userController.updateEmail);

// Update password (with current password check)
router.put('/update-password', isAuthenticated, userController.updatePassword);

// Delete user account
router.delete('/me', isAuthenticated, userController.deleteProfile);

module.exports = router;
