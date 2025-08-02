const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const otpController = require('../controllers/otpController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/logout', authController.logout);
router.post('/send-otp',otpController.sendOTP);
router.post('/verify-otp',otpController.verifyOTP);
router.post('/reset-password', authController.resetPassword);

module.exports = router;