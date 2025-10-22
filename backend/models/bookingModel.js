const { db } = require('../config/db');

// Check if any seats are already booked
exports.checkUnavailableSeats = (seatIds) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT ShowSeatID FROM Show_Seat
      WHERE Seat_Status != 0 AND ShowSeatID IN (?)
    `;
    db.query(query, [seatIds], (err, results) => {
      if (err) return reject(err);
      resolve(results.map(r => r.ShowSeatID));
    });
  });
};

exports.createBooking = (userId, showId, numberOfSeats) => {
  return new Promise((resolve, reject) => {
    db.query(`SELECT MAX(BookingID) as maxId from Booking`, (err, result) => {
      if (err) return reject(err);

      const newBookingId = result[0].maxId ? result[0].maxId + 1 : 1;
      console.log("Booking Number", newBookingId);

      const query = `
        INSERT INTO Booking (BookingID, UserID, ShowID, NumberOfSeats, Booking_Timestamp, Booking_Status)
        VALUES (?, ?, ?, ?, NOW(), 1)
      `;
      db.query(query, [newBookingId, userId, showId, numberOfSeats], (err, result) => {
        if (err) return reject(err);
        console.log("Booking created", result);
        resolve(newBookingId);
      });
    });
  });
};


exports.assignSeatsToBooking = (bookingId, seatIds) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE Show_Seat
      SET BookingID = ?
      WHERE ShowSeatID IN (?) AND Seat_Status = 1
    `;
    db.query(query, [bookingId, seatIds], (err, result) => {
      if (err) return reject(err);
      resolve(true);
    });
  });
};

exports.releaseSeats = (seatIds) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE Show_Seat
      SET Seat_Status = 0, BookingID = NULL
      WHERE ShowSeatID IN (?)
    `;
    db.query(query, [seatIds], (err, result) => {
      if (err) return reject(err);
      resolve(true);
    });
  });
};

exports.finalizeSeatsAfterPayment = (bookingId, seatIds) => {
  return new Promise((resolve, reject) => {
    if (!seatIds || seatIds.length === 0) return resolve(false);

    const placeholders = seatIds.map(() => '?').join(',');

    const query = `
      UPDATE Show_Seat
      SET Seat_Status = 2
      WHERE BookingID = ? AND ShowSeatID IN (${placeholders}) AND Seat_Status = 1
    `;

    db.query(query, [bookingId, ...seatIds], (err, result) => {
      if (err) return reject(err);

      if (result.affectedRows === 0) {
        return reject(new Error("None of the selected seats were available."));
      }

      resolve(true);
    });
  });
};





exports.holdSeats = (bookingId, seatIds) => {
  return new Promise((resolve, reject) => {
    if (!seatIds || seatIds.length === 0) return resolve(0);

    const placeholders = seatIds.map(() => '?').join(',');

    const query = `
      UPDATE Show_Seat
      SET Seat_Status = 1, BookingID = ?
      WHERE ShowSeatID IN (${placeholders}) AND Seat_Status = 0
    `;

    db.query(query, [bookingId, ...seatIds], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows);
    });
  });
};


exports.getSeatDetails = (showId, seatIds) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT ss.ShowSeatID, ss.Seat_Status, ss.Price, cs.SeatNumber
      FROM Show_Seat ss
      JOIN Cinema_Seat cs ON ss.CinemaSeatID = cs.CinemaSeatID
      WHERE ss.ShowID = ? AND ss.ShowSeatID IN (?)
    `;
    db.query(query, [showId, seatIds], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

exports.getShowDetails = (showId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ms.ShowID,
        ms.Show_Date,
        ms.StartTime,
        ms.Format,
        ms.Show_Language,
        m.Title AS MovieTitle,
        m.Poster_Image_URL,
        ch.Hall_Name,
        c.Cinema_Name,
        c.CityID
      FROM Movie_Show ms
      JOIN Movie m ON ms.MovieID = m.MovieID
      JOIN Cinema_Hall ch ON ms.CinemaHallID = ch.CinemaHallID
      JOIN Cinema c ON ch.CinemaID = c.CinemaID
      WHERE ms.ShowID = ?
    `;
    db.query(query, [showId], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);  // only one show
    });
  });
};


exports.getUserBookings = (userId,callback) => {
  
    const query = `
      SELECT 
    b.BookingID,
    b.Booking_Timestamp,
    b.NumberOfSeats,
    b.Booking_Status,
    u.User_Name,
    m.Title AS Movie_Name,
    ms.Show_Date,
    ms.StartTime,
    ms.EndTime,
    ch.Hall_Name AS Cinema_Hall,
    c.Cinema_Name AS Cinema_Name,
    ci.City_Name AS City_Name,
    GROUP_CONCAT(cs.SeatName ORDER BY cs.SeatName SEPARATOR ', ') AS Selected_Seats,
    SUM(ss.Price) AS Total_Amount
FROM Booking b
JOIN User u ON b.UserID = u.UserID
JOIN Movie_Show ms ON b.ShowID = ms.ShowID
JOIN Movie m ON ms.MovieID = m.MovieID
JOIN Cinema_Hall ch ON ms.CinemaHallID = ch.CinemaHallID
JOIN Cinema c ON ch.CinemaID = c.CinemaID
JOIN City ci ON c.CityID = ci.CityID
JOIN Show_Seat ss ON ss.BookingID = b.BookingID
JOIN Cinema_Seat cs ON ss.CinemaSeatID = cs.CinemaSeatID
WHERE b.UserID = ?
GROUP BY 
    b.BookingID, 
    b.Booking_Timestamp,
    b.NumberOfSeats,
    b.Booking_Status,
    u.User_Name,
    m.Title,
    ms.Show_Date,
    ms.StartTime,
    ms.EndTime,
    ch.Hall_Name,
    c.Cinema_Name,
    ci.City_Name
ORDER BY b.Booking_Timestamp DESC;

    `;
    db.query(query, [userId], (err, results) => {
      if (err) return callback(err,null);
      return callback(null,results);  // only one show
    });
  
};
