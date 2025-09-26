const { db } = require('../config/db');

exports.getReviewsByMovie = (movieId, callback) => {
  const sql = `
    SELECT r.ReviewID, r.Rating, r.Comment, r.Review_Timestamp, u.User_Name AS username
    FROM Review r
    JOIN User u ON r.UserID = u.UserID
    WHERE r.MovieID = ?
    ORDER BY r.Review_Timestamp DESC
  `;
  db.query(sql, [movieId], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

exports.addReview = (reviewData, callback) => {
  const { UserID, MovieID, Rating, Comment } = reviewData;
  const sql = `
    INSERT INTO Review (UserID, MovieID, Rating, Comment)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [UserID, MovieID, Rating, Comment], (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};
