// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// GET /api/movies/:movieId/reviews
router.get('/:movieId/reviews', reviewController.getReviews);

// POST /api/movies/:movieId/reviews
router.post('/:movieId/reviews', reviewController.addReview);

module.exports = router;
