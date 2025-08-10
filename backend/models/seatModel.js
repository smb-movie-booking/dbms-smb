const { db } = require('../config/db');

exports.fetchSeatsByShowId = (showId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT ss.ShowSeatID, ss.Seat_Status, ss.Price, cs.SeatNumber
      FROM Show_Seat ss
      JOIN Cinema_Seat cs ON ss.CinemaSeatID = cs.CinemaSeatID
      WHERE ss.ShowID = ?
    `;
    
    db.query(query, [showId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};
