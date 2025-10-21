const bookingModel = require('../models/bookingModel');

exports.confirmBooking = (req, res) => {
  const { userId, showId, seatSelections } = req.body;
  console.log("payment Page",req.body);
  const seatIds = seatSelections.map(s => s.seatId);
  

  try {
    // Step 1: Hold seats (Seat_Status = 1)
    

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
