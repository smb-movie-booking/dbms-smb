const { db } = require('../config/db');
const bookingModel = require('../models/bookingModel');

exports.processPayment = async (req, res) => {
  const {
    bookingId,
    amount,
    paymentMethod,
    remoteTransactionId,
    discountCouponId,
    seatIds // MUST be passed from frontend to finalize/release seats
  } = req.body;

  try {
    // Start transaction (optional but ideal)
    await db.beginTransaction();

    // Step 1: Insert payment
    const insertQuery = `
      INSERT INTO Payment (
        PaymentID, Amount, Payment_Timestamp,
        DiscountCouponID, RemoteTransactionID,
        PaymentMethod, BookingID
      )
      VALUES (NULL, ?, NOW(), ?, ?, ?, ?)
    `;

    const insertValues = [amount, discountCouponId, remoteTransactionId, paymentMethod, bookingId];

    await new Promise((resolve, reject) => {
      db.query(insertQuery, insertValues, (err, result) => {
        if (err) return reject(err);
        resolve(result.insertId); // paymentId
      });
    });

    // Step 2: Finalize seats
    await bookingModel.finalizeSeatsAfterPayment(bookingId, seatIds);

    // Step 3: Update booking status to "Paid" (2)
    await new Promise((resolve, reject) => {
      db.query(`UPDATE Booking SET Booking_Status = 2 WHERE BookingID = ?`, [bookingId], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Commit transaction
    await db.commit();

    res.status(201).json({ success: true, bookingId });
  } catch (err) {
    console.error('❌ Payment failed, rolling back...', err);

    // Rollback seat hold and booking
    try {
      await db.rollback();

      // Release seats: Seat_Status = 0, BookingID = NULL
      await bookingModel.releaseSeats(seatIds);

      // Optionally, mark booking as cancelled
      await new Promise((resolve, reject) => {
        db.query(`UPDATE Booking SET Booking_Status = 3 WHERE BookingID = ?`, [bookingId], (err) => {
          if (err) return reject(err);
          resolve();
        });
      });

    } catch (rollbackErr) {
      console.error('❌ Rollback failed:', rollbackErr);
    }

    res.status(500).json({ error: 'Payment failed, booking cancelled' });
  }
};
