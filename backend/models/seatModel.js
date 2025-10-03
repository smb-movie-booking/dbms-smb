const { db } = require('../config/db');

exports.fetchSeatsByShowId = (showId) => {
  return new Promise((resolve, reject) => {
    const query = `
       SELECT
         ms.ShowID,
	 ms.Show_Date as showDate,
	 ms.StartTime as startTime,
         m.MovieID,
         m.Title,
	 c.Cinema_Name,
         cs.CinemaSeatID AS seatId,
         cs.Seat_Type AS seatType,
         ss.Price as price,
         CASE
             WHEN ss.Seat_Status = 2 THEN 'booked'
             WHEN ss.Seat_Status = 1 THEN 'blocked'
             ELSE 'available'
         END AS status
     FROM
         Movie_Show ms
     JOIN Movie m ON ms.MovieID = m.MovieID
     JOIN Cinema_Hall ch ON ms.CinemaHallID = ch.CinemaHallID
     JOIN Cinema_Seat cs ON cs.CinemaHallID = ch.CinemaHallID
     LEFT JOIN Show_Seat ss ON ss.ShowID = ms.ShowID AND ss.CinemaSeatID = cs.CinemaSeatID
     JOIN Cinema c on c.CinemaID=ch.CinemaID
     WHERE
     ms.ShowID=? ORDER BY cs.Seat_Type,cs.SeatNumber;
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
