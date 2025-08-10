const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');
const seatController = require('../controllers/seatController');

// POST /api/shows/filter
router.post('/filter', showController.getShowsByMovieTheaterDate);
router.get('/:showId/seats', seatController.getSeatsByShowId);

module.exports = router;
