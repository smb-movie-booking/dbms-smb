const express = require('express');
const router = express.Router();
const showController = require('../controllers/showController');

// POST /api/shows/filter
router.post('/filter', showController.getShowsByMovieTheaterDate);

module.exports = router;
