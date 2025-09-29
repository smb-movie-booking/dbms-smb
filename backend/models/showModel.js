const { db } = require('../config/db');

exports.getShowsByMovieAndTheaters = (movieId, theaterIds, date, filters, callback) => {
  if (!theaterIds || theaterIds.length === 0) {
    return callback(null, []);
  }

  let sql = `
    SELECT
      ms.ShowID AS showId,
      TIME_FORMAT(ms.StartTime, '%h:%i %p') AS startTime,
      ms.Format AS format,
      ms.Show_Language AS showLanguage,
      ch.CinemaID
    FROM Movie_Show ms
    JOIN Cinema_Hall ch ON ms.CinemaHallID = ch.CinemaHallID
    WHERE ms.MovieID = ?
      AND ch.CinemaID IN (?)
      AND DATE(ms.Show_Date) = ?
      AND ms.isActive = TRUE
  `;
  
  const params = [movieId, theaterIds, date];

  // Dynamically add filters
  if (filters.format) {
    sql += ` AND ms.Format = ?`;
    params.push(filters.format);
  }
  if (filters.language) {
    sql += ` AND ms.Show_Language = ?`;
    params.push(filters.language);
  }
  
  // --- NEW: Add Preferred Time Filter Logic ---
  if (filters.preferredTime) {
    switch (filters.preferredTime) {
      case 'morning':
        sql += ` AND TIME(ms.StartTime) < '12:00:00'`;
        break;
      case 'afternoon':
        sql += ` AND TIME(ms.StartTime) BETWEEN '12:00:00' AND '16:59:59'`;
        break;
      case 'evening':
        sql += ` AND TIME(ms.StartTime) BETWEEN '17:00:00' AND '20:59:59'`;
        break;
      case 'night':
        sql += ` AND TIME(ms.StartTime) >= '21:00:00'`;
        break;
    }
  }

  sql += ` ORDER BY ms.StartTime;`;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching shows with filters:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};


exports.fetchShowsByTheaterAndDate = (theaterID, showDate) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                ms.ShowID,
                ms.MovieID,
                TIME_FORMAT(ms.StartTime, '%H:%i') AS ShowTime,
                ss.Price,
                ms.Format,
                m.Title,
                m.Movie_Language,
                m.Genre,
                m.Age_Format
            FROM Movie_Show ms
            JOIN Cinema_Hall ch ON ms.CinemaHallID = ch.CinemaHallID
            JOIN Movie m ON ms.MovieID = m.MovieID
            LEFT JOIN Show_Seat ss ON ms.ShowID = ss.ShowID
            WHERE ch.CinemaID = ? 
              AND DATE(ms.Show_Date) = ?
            ORDER BY m.MovieName, ms.StartTime ASC
        `;

        db.query(query, [theaterID, showDate], (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};
