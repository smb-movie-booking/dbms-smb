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
    const query = `
      INSERT INTO Booking (UserID, ShowID, NumberOfSeats, Booking_Timestamp, Booking_Status)
      VALUES (?, ?, ?, NOW(), 1)
    `;
    db.query(query, [userId, showId, numberOfSeats], (err, result) => {
      if (err) return reject(err);
      resolve(result.insertId);
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


// After payment success: update Seat_Status = 2 (booked)
exports.finalizeSeatsAfterPayment = (bookingId, seatIds) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE Show_Seat
      SET Seat_Status = 2
      WHERE ShowSeatID IN (?) AND BookingID = ?
    `;
    db.query(query, [seatIds, bookingId], (err, result) => {
      if (err) return reject(err);
      resolve(true);
    });
  });
};


// Instead of setting BookingID directly, just hold the seats
exports.holdSeats = (seatIds) => {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE Show_Seat
      SET Seat_Status = 1
      WHERE ShowSeatID IN (?) AND Seat_Status = 0
    `;
    db.query(query, [seatIds], (err, result) => {
      if (err) return reject(err);
      resolve(result.affectedRows); // Optional check
    });
  });
}

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
