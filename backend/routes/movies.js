const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const reviewController = require('../controllers/reviewController');

router.get('/explore',movieController.handleExplore);
router.get("/cities", movieController.getCities);

router.get('/search',movieController.getMoviesBySearch)
router.get('/:movieId/reviews', reviewController.getReviews);

// POST /api/movies/:movieId/reviews
router.post('/:movieId/reviews', reviewController.addReview);


module.exports = router;
