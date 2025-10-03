const express = require('express');
const router = express.Router();
const seatController = require('../controllers/seatController');

// This single route handles all theater-related lookups
// e.g., /api/theaters/lookup?movie=123&showDate=2025-09-29
router.get('/show/:showid', seatController.getSeatsByShowId);

module.exports = router;