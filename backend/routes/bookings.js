const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/summary', bookingController.getBookingSummary);
router.post('/confirm', bookingController.confirmBooking);

module.exports = router;