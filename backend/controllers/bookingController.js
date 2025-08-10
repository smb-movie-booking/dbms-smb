const bookingModel = require('../models/bookingModel');

exports.confirmBooking = async (req, res) => {
  const { userId, showId, seatSelections } = req.body;
  const seatIds = seatSelections.map(s => s.showSeatId);

  try {
    // Step 1: Hold seats (Seat_Status = 1)
    const heldCount = await bookingModel.holdSeats(seatIds);
    if (heldCount !== seatIds.length) {
      return res.status(409).json({ error: 'One or more seats already held/booked' });
    }

    // Step 2: Create Booking (status = 1)
    const bookingId = await bookingModel.createBooking(userId, showId, seatIds.length);

    // Step 3: Link held seats to booking
    await bookingModel.assignSeatsToBooking(bookingId, seatIds);

    res.status(201).json({ success: true, bookingId });
  } catch (err) {
    console.error('❌ Confirm booking failed:', err);
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
