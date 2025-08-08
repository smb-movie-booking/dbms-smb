const { db } = require('../config/db');

exports.fetchShows = (movieID, theaterID, showDate) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                ms.ShowID, 
                TIME_FORMAT(ms.StartTime, '%H:%i') AS ShowTime,
                ms.CinemaHallID
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
