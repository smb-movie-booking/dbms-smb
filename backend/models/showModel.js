const { db } = require('../config/db');

exports.fetchShows = (movieID, theaterID, showDate) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                ms.ShowID, 
                TIME_FORMAT(ms.StartTime, '%H:%i') AS ShowTime
            FROM Movie_Show ms
            JOIN Cinema_Hall ch ON ms.CinemaHallID = ch.CinemaHallID
            WHERE ms.MovieID = ? 
              AND ch.CinemaID = ? 
              AND DATE(ms.Show_Date) = ?
            ORDER BY ms.StartTime ASC
        `;

        db.query(query, [movieID, theaterID, showDate], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
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
