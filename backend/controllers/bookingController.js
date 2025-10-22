const bookingModel = require('../models/bookingModel');

exports.confirmBooking = (req, res) => {
  const { userId, showId, seatSelections } = req.body;
  const seatIds = seatSelections.map(s => s.showSeatId);
  let seatsSuccessfullyHeld = false; // Flag to track if hold succeeded

  try {
    // Step 1: Hold seats (Seat_Status = 1)
    const heldCount = await bookingModel.holdSeats(seatIds);
    if (heldCount !== seatIds.length) {
      // If hold failed partially or fully (race condition), no need to release, just return error
      return res.status(409).json({ error: 'One or more seats already held/booked' });
    }
    seatsSuccessfullyHeld = true; // Mark that seats were held

    // Step 2: Create Booking (status = 1)
    bookingModel.createBooking(userId, showId, seatIds.length,(err,newBookingId)=>{
      if (err) {
      console.error("Booking creation failed:", err);
      return res.status(500).json({ error: "Booking failed" });
    }
    console.log("Booking created with ID:", newBookingId);
    bookingModel.finalizeSeatsAfterPayment(newBookingId, seatIds,(err,result)=>{
      if(err)return res.status(500).json({ error: "Finalizing seats failed" });
      console.log("Seats finalized for booking ID:", newBookingId);
      return res.status(201).json({ success: true, bookingId: newBookingId});
    });
    });

    // Step 3: Link held seats to booking
    await bookingModel.assignSeatsToBooking(bookingId, seatIds);

    // If all steps succeed:
    res.status(201).json({ success: true, bookingId });

  } catch (err) {
    console.error('❌ Confirm booking failed:', err);

    // --- NEW ROLLBACK LOGIC ---
    // If seats were successfully held BUT the subsequent steps failed, release them.
    if (seatsSuccessfullyHeld) {
      console.log('Attempting to release held seats due to error during booking confirmation...');
      try {
        await bookingModel.releaseSeats(seatIds);
        console.log('Held seats released successfully.');
      } catch (releaseErr) {
        // Log this critical error - manual cleanup might be needed
        console.error('❌ CRITICAL: Failed to release held seats after booking confirmation error:', releaseErr);
      }
    }
    // --- END NEW LOGIC ---

    // Send generic error response
    res.status(500).json({ error: 'Booking process failed' });
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
