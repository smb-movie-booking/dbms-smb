const { db } = require('../config/db');
const bookingModel = require('../models/bookingModel');

exports.processPayment = async (req, res) => {
  const {
    bookingId,
    amount,
    paymentMethod,
    remoteTransactionId,
    discountCouponId,
    seatIds
  } = req.body;

  const connection = await db.promise().getConnection(); // get connection from pool

  try {
    await connection.beginTransaction();

    // Step 1: Insert payment
    const insertQuery = `
      INSERT INTO Payment (
        PaymentID, Amount, Payment_Timestamp,
        DiscountCouponID, RemoteTransactionID,
        PaymentMethod, BookingID
      )
      VALUES (NULL, ?, NOW(), ?, ?, ?, ?)
    `;
    await connection.query(insertQuery, [
      amount,
      discountCouponId,
      remoteTransactionId,
      paymentMethod,
      bookingId
    ]);

    // Step 2: Finalize seats
    await bookingModel.finalizeSeatsAfterPayment(bookingId, seatIds);

    // Step 3: Update booking status to "Paid"
    await connection.query(
      `UPDATE Booking SET Booking_Status = 2 WHERE BookingID = ?`,
      [bookingId]
    );

    await connection.commit();
    connection.release(); // release connection

    res.status(201).json({ success: true, bookingId });
  } catch (err) {
    console.error('❌ Payment failed, rolling back...', err);
    try {
      await connection.rollback();
      await bookingModel.releaseSeats(seatIds);
      await db
        .promise()
        .query(`UPDATE Booking SET Booking_Status = 3 WHERE BookingID = ?`, [
          bookingId,
        ]);
    } catch (rollbackErr) {
      console.error('❌ Rollback failed:', rollbackErr);
    } finally {
      connection.release();
    }

    res.status(500).json({ error: 'Payment failed, booking cancelled' });
  }
};
