// controllers/reviewController.js
const reviewModel = require('../models/reviewModel');

// Get all reviews for a movie
exports.getReviews = (req, res) => {
  const movieId = req.params.movieId;
  reviewModel.getReviewsByMovie(movieId, (err, reviews) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch reviews' });
    }
    res.json(reviews);
  });
};

// Add a new review
exports.addReview = (req, res) => {
  const { UserID, MovieID, Rating, Comment } = req.body;
  if (!UserID || !MovieID || !Rating || !Comment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  reviewModel.addReview({ UserID, MovieID, Rating, Comment }, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to add review' });
    }
    res.status(201).json({ message: 'Review added successfully', reviewId: result.insertId });
  });
};
