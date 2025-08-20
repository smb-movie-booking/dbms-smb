const {db} = require('../config/db');

const getMovieDetails = async (movieId) => {
  const [rows] = await db.query(
    `SELECT MovieId, MovieName, Poster_Image_URL, Trailer_URL, Rating,
           Genre, Movie_Language, ReleaseDate, Duration, AgeFormat, Movie_Description
    FROM movie
    WHERE MovieId = ?`, [movieId]);
  return rows[0];
};

const getMoviesByTheaterAndDate = async (theaterId, date) => {
  const [rows] = await db.query(
    `SELECT DISTINCT m.MovieId, m.MovieName, m.Movie_Language, m.Genre, m.Poster_Image_URL, ms.Format
    FROM movie m
    JOIN movie_show ms ON m.MovieId = ms.MovieId
    JOIN cinema_hall ch ON ms.HallId = ch.HallId
    WHERE ch.CinemaId = ? AND DATE(ms.ShowDate) = ?`, [theaterId, date]);
  return rows;
};

const getMoviesByCity = async (cityId, filters) => {
  let query = `
    SELECT DISTINCT m.MovieId, m.MovieName, m.Poster_Image_URL, m.Rating, m.Genre, m.Movie_Language
    FROM movie m
    JOIN movie_show ms ON m.MovieId = ms.MovieId
    JOIN cinema_hall ch ON ms.HallId = ch.HallId
    JOIN cinema c ON ch.CinemaId = c.CinemaId
    WHERE c.CityId = ?`;
  const params = [cityId];

  if (filters.language) {
    query += " AND m.Movie_Language IN (?)";
    params.push(filters.language.split(","));
  }
  if (filters.genre) {
    query += " AND m.Genre = ?";
    params.push(filters.genre);
  }
  if (filters.format) {
    query += " AND ms.Format = ?";
    params.push(filters.format);
  }

  const [rows] = await db.query(query, params);
  return rows;
};

export default { getMovieDetails, getMoviesByTheaterAndDate, getMoviesByCity };