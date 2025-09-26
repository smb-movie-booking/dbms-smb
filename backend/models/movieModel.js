const {db} = require('../config/db');

const getMovieDetails = (movieId, callback) => {
  const sql = `
    SELECT MovieID, Title, Poster_Image_URL, Trailer_URL, Rating,
           Genre, Movie_Language, ReleaseDate, Duration, Age_Format, Movie_Description
    FROM Movie
    WHERE MovieID = ?`;

  db.query(sql, [movieId], (err, rows) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, rows[0]);
  });
};

const getMoviesByTheaterAndDate = (theaterId, date, callback) => {
  const sql = `
    SELECT DISTINCT m.MovieID, m.Title, m.Movie_Language, m.Genre, m.Poster_Image_URL, ms.Format
    FROM Movie m
    JOIN Movie_Show ms ON m.MovieID = ms.MovieID
    JOIN cinema_hall ch ON ms.CinemaHallID = ch.CinemaHallID
    WHERE ch.CinemaID = ? AND DATE(ms.Show_Date) = ?`;

  db.query(sql, [theaterId, date], (err, rows) => {
    if (err) return callback(err, null);
    callback(null, rows);
  });
};


const getMoviesByCity = (cityId, filters, callback) => {
  let query = `
    SELECT DISTINCT m.MovieID, m.Title, m.Poster_Image_URL, m.Rating, m.Genre, m.Movie_Language
    FROM Movie m
    JOIN Movie_Show ms ON m.MovieID = ms.MovieID
    JOIN Cinema_Hall ch ON ms.CinemaHallID = ch.CinemaHallID
    JOIN Cinema c ON ch.CinemaID = c.CinemaID
    WHERE c.CityID = ?`;
  const params = [cityId];

  if (filters.language) {
    query += " AND m.Movie_Language IN (?)";
    params.push(filters.language.split(","));
  }
  if (filters.genre) {
    query += " AND m.Genre IN (?)";
    params.push(filters.genre.split(","));
  }
  if (filters.format) {
    query += " AND ms.Format IN (?)";
    params.push(filters.format.split(","));
  }

  db.query(query, params, (err, results) => {
    if (err) return callback(err);
    callback(null, results);
  });
};

module.exports = { getMovieDetails, getMoviesByTheaterAndDate, getMoviesByCity };