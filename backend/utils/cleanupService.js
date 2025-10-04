const { db } = require('../config/db');
const cron = require('node-cron');

// We can reuse the releaseSeats function from your booking model
const bookingModel = require('../models/bookingModel');

const BOOKING_EXPIRATION_MINUTES = 10; // Set the expiration time to 10 minutes

/**
 * This function finds pending bookings that are older than the expiration time,
 * releases their seats, and marks the booking as "Expired".
 */
const cancelExpiredBookings = async () => {
  console.log(`[${new Date().toISOString()}] Running cleanup job for expired bookings...`);
  
  try {
    // Step 1: Find all BookingIDs for pending bookings that have expired
    const findExpiredQuery = `
      SELECT BookingID FROM Booking
      WHERE Booking_Status = 1 
        AND Booking_Timestamp < NOW() - INTERVAL ? MINUTE
    `;
    
    const [expiredBookings] = await db.promise().query(findExpiredQuery, [BOOKING_EXPIRATION_MINUTES]);

    if (expiredBookings.length === 0) {
      console.log('No expired bookings to clean up.');
      return;
    }

    const expiredBookingIds = expiredBookings.map(b => b.BookingID);
    console.log(`Found expired bookings: ${expiredBookingIds.join(', ')}`);

    // Step 2: Find all seats associated with these expired bookings
    const findSeatsQuery = `
      SELECT ShowSeatID FROM Show_Seat
      WHERE BookingID IN (?)
    `;

    const [seatsToRelease] = await db.promise().query(findSeatsQuery, [expiredBookingIds]);
    const seatIdsToRelease = seatsToRelease.map(s => s.ShowSeatID);

    if (seatIdsToRelease.length > 0) {
      // Step 3: Release the seats (reuse your existing model function)
      await bookingModel.releaseSeats(seatIdsToRelease);
      console.log(`Released seats: ${seatIdsToRelease.join(', ')}`);
    }

    // Step 4: Update the booking status to "Expired" (e.g., status 4)
    const updateBookingQuery = `
      UPDATE Booking SET Booking_Status = 4 WHERE BookingID IN (?)
    `;

    await db.promise().query(updateBookingQuery, [expiredBookingIds]);
    console.log(`Updated booking statuses to 'Expired'.`);

  } catch (error) {
    console.error('❌ Error during cleanup job:', error);
  }
};

/**
 * Schedules the cleanup job to run at a set interval.
 * Cron syntax: [minute] [hour] [day_of_month] [month] [day_of_week]
 * '* * * * *' means "run every minute".
 */
const startCleanupJob = () => {
  cron.schedule('* * * * *', cancelExpiredBookings, {
    scheduled: true,
    timezone: "Asia/Kolkata" // Set to your server's timezone
  });
  console.log('✅ Expired booking cleanup job scheduled to run every minute.');
};

module.exports = { startCleanupJob };