// bookingController.js
const bookingModel = require('../models/bookingModel');
const { db } = require('../config/db');

/**
 * Robust helper: if fn(...) returns a thenable, use it.
 * Otherwise assume Node-style callback last-arg and wrap it.
 */
async function callModel(fn, ...args) {
  // Try calling fn; if it returns a thenable, return that
  try {
    const possible = fn(...args);
    if (possible && typeof possible.then === 'function') {
      return await possible;
    }
  } catch (err) {
    // Some callback-style functions may throw synchronously when called without a callback.
    // We'll fall back to wrapping below.
  }

  // Wrap a callback-style function (last argument is callback(err, result))
  return new Promise((resolve, reject) => {
    try {
      fn(...args, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    } catch (err) {
      reject(err);
    }
  });
}

exports.confirmBooking = async (req, res) => {
  const { userId, showId, seatSelections } = req.body;

  if (!userId || !showId || !Array.isArray(seatSelections) || seatSelections.length === 0) {
    return res.status(400).json({ error: 'Invalid request payload' });
  }

  const seatIds = seatSelections.map(s => s.showSeatId);
  let connection;
  let bookingId = null;

  try {
    console.log('Confirm booking request:', { userId, showId, seatIds });

    // Step 0: Get DB connection
    connection = await db.promise().getConnection();
    console.log('DB connection acquired');

    await connection.beginTransaction();
    console.log('Transaction started');

    // Step 1: Create booking first
    const createResult = await bookingModel.createBooking(userId, showId, seatIds.length);
    bookingId = createResult.insertId ? createResult.insertId : createResult;
    console.log('Booking created with ID:', bookingId);

    if (!bookingId) throw new Error('Failed to create booking');

    // Step 2: Hold seats for this booking
    const heldCount = await bookingModel.holdSeats(bookingId, seatIds);
    console.log(`Seats held: ${heldCount}/${seatIds.length}`);

    if (heldCount !== seatIds.length) {
      // If any seat already held/booked, rollback immediately
      await connection.rollback();
      console.warn('Not all seats could be held, rolling back booking');
      return res.status(409).json({ error: 'One or more seats already held/booked' });
    }

    // Step 3: Assign seats to booking (optional, may already be done in holdSeats)
    await bookingModel.assignSeatsToBooking(bookingId, seatIds);

    // Step 4: Commit transaction
    await connection.commit();
    console.log('Transaction committed successfully');

    return res.status(201).json({ success: true, bookingId });

  } catch (err) {
    console.error('❌ Booking confirmation failed:', err);

    // Rollback and release seats if bookingId exists
    if (connection) {
      try {
        await connection.rollback();
        console.log('Transaction rolled back');

        if (bookingId) {
          await bookingModel.releaseSeats(seatIds);
          console.log('Held seats released due to failure');
        }
      } catch (releaseErr) {
        console.error('❌ Failed to release seats during rollback:', releaseErr);
      } finally {
        connection.release();
      }
    }

    return res.status(500).json({ error: 'Booking process failed', details: err.message });
  } finally {
    if (connection) connection.release();
  }
};

exports.getBookingSummary = async (req, res) => {
  const { showId, seatIds } = req.body;

  try {
    const showDetails = await bookingModel.getShowDetails(showId);
    const seats = await bookingModel.getSeatDetails(showId, seatIds);

    const unavailable = seats.filter(s => s.Seat_Status !== 0);
    if (unavailable.length > 0) {
      return res.status(409).json({ error: 'Some seats are already booked', unavailable });
    }

    const totalPrice = seats.reduce((sum, seat) => sum + parseFloat(seat.Price), 0);

    res.json({
      show: showDetails,
      seats,
      totalPrice
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch summary' });
  }
};

exports.getOrderDetails=(req,res)=>{
  const {userId}=req.params;
  bookingModel.getUserBookings(userId,(err,bookings)=>{
    if(err){
      return res.status(500).json({ error: 'Could not fetch bookings' });
    }
    console.log("Bookings fetched:",bookings);
    return res.status(200).json({bookings});
  })
}
