const express = require('express');
const router = express.Router();
const theaterController = require('../controllers/theaterController');

// This single route handles all theater-related lookups
// e.g., /api/theaters/lookup?movie=123&showDate=2025-09-29
router.get('/lookup', theaterController.handleTheaterLookup);

module.exports = router;