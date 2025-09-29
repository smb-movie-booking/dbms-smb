const { db } = require('../config/db');

/**
 * Fetches a list of unique theaters showing a specific movie on a specific date.
 */
const getTheatersByMovieAndDate = (movieId, date, cityId, callback) => {
  const sql = `
    SELECT DISTINCT
      c.CinemaID,
      c.Cinema_Name AS cinemaName,
      c.Facilities,
      c.Cancellation_Allowed AS cancellationAllowed
    FROM Cinema c
    JOIN Cinema_Hall ch ON c.CinemaID = ch.CinemaID
    JOIN Movie_Show ms ON ch.CinemaHallID = ms.CinemaHallID
    WHERE ms.MovieID = ?
      AND DATE(ms.Show_Date) = ?
      AND c.CityID = ? 
      AND ms.isActive = TRUE
    ORDER BY c.Cinema_Name;
  `;

  // The parameters must be in the same order as the '?' placeholders in the query
  db.query(sql, [movieId, date, cityId], (err, results) => {
    if (err) {
      console.error("Error fetching theaters by movie, date, and city:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

// Note: Your teammates will implement the logic for these other functions.
const getTheaterDetails = (theaterId, callback) => {
  // Placeholder for single theater details
};

const getTheatersByCity = (cityId, callback) => {
  // Placeholder for fetching all theaters in a city
};


module.exports = {
  getTheatersByMovieAndDate,
  getTheaterDetails,
  getTheatersByCity
};
