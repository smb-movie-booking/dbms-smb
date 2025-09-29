const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/explore',movieController.handleExplore);
router.get("/cities", movieController.getCities);

router.get('/search',movieController.getMoviesBySearch)


module.exports = router;
