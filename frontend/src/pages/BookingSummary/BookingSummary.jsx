import React, { useState, useContext } from "react"; // Added useContext
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingSummary.css";
import toast from "react-hot-toast";
import { Auth } from "../../Context/AuthContext"; // Assuming your Auth context path
import { axiosInstance } from "../../utils/axios"; // Assuming axios instance path

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { authUser } = useContext(Auth); // Get logged-in user info

  const { showId, seatInfo = {}, selectedSeats = { seats: [], totalPrice: 0 } } = location.state || {};

  const [isProcessing, setIsProcessing] = useState(false); // Loading state

  // Robust check for essential data
  if (!selectedSeats.seats || selectedSeats.seats.length === 0 || !seatInfo.title || !showId) {
    React.useEffect(() => {
      toast.error("Booking details missing. Redirecting...", { duration: 1500 });
      const timer = setTimeout(() => navigate("/"), 1500);
      return () => clearTimeout(timer);
    }, [navigate]);
    return null;
  }

  const total = selectedSeats.totalPrice;
  const movieTitle = seatInfo.title;
  const cinemaName = seatInfo.cinema;
  const showDate = seatInfo.showDate ? new Date(seatInfo.showDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : 'N/A';
  const startTime = seatInfo.startTime ? new Date(seatInfo.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A';

  // --- NEW FUNCTION ---
  const handleProceedToPayment = async () => {
    console.log("Auth User on Confirm:", authUser);
    if (!authUser) {
      toast.error("Please log in to proceed.");
      navigate("/login", { state: { from: location } }); // Redirect to login
      return;
    }
    setIsProcessing(true);
    toast.loading("Holding seats..."); // Give feedback

    try {
      // Prepare seat selections in the format expected by the backend
      const seatSelections = selectedSeats.seats.map(seat => ({
        showSeatId: seat.showSeatId // Assuming 'seatId' holds the ShowSeatID
      }));

      // --- PHASE 1 API CALL ---
      const response = await axiosInstance.post('/api/booking/confirm', {
        userId: authUser.user.id, // Pass the logged-in user's ID
        showId: showId,
        seatSelections: seatSelections
      });
      // --- END PHASE 1 ---

      const { bookingId } = response.data;
      toast.dismiss(); // Clear loading toast
      toast.success("Seats held! Proceeding to payment.");

      // Navigate to payment page, PASSING the bookingId
      navigate("/payment", {
        state: {
          bookingId, // <-- Pass the new booking ID
          showId,
          selectedSeats,
          seatInfo,
          total
        }
      });

    } catch (err) {
      toast.dismiss();
      if (err.response && err.response.status === 409) {
        toast.error("Sorry, some selected seats are no longer available. Please try again.");
        // Optionally navigate back to seat selection
        // navigate(`/seat/show/${showId}`);
      } else {
        console.error("Booking confirmation failed:", err);
        toast.error("Could not hold seats. Please try again later.");
      }
    } finally {
      setIsProcessing(false);
    }
  };
  // --- END NEW FUNCTION ---

  return (
    <div className="booking-summary-page">
      <div className="booking-summary-card">
        <h2 className="summary-title">Booking Summary</h2>

        {/* --- Sections remain the same --- */}
        <div className="summary-section movie-details">
          {/* ... Movie details ... */}
           <h3 className="section-title">Show Details</h3>
          <div className="detail-item">
            <span className="detail-label">🎬 Movie:</span>
            <span className="detail-value">{movieTitle}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📍 Cinema:</span>
            <span className="detail-value">{cinemaName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">📅 Date:</span>
            <span className="detail-value">{showDate}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">⏰ Time:</span>
            <span className="detail-value">{startTime}</span>
          </div>
        </div>

        <div className="summary-section seat-details">
         <h3 className="section-title">Selected Seats ({selectedSeats.seats.length})</h3>
          <ul className="seat-list">
            {selectedSeats.seats.map((seat) => (
              <li key={seat.seatId} className="seat-item">
                <span className="seat-name">{seat.seatName}</span>
                <span className="seat-price">₹{parseFloat(seat.price).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="summary-section total-section">
          {/* ... Total ... */}
           <h3 className="total-label">Grand Total:</h3>
          <span className="total-price">₹{parseFloat(total).toFixed(2)}</span>
        </div>
        {/* --- End Sections --- */}

        {/* Payment Button - Updated onClick */}
        <div className="payment-actions">
          <button
            className="proceed-button"
            onClick={handleProceedToPayment} // <-- Use the new handler
            disabled={isProcessing} // <-- Disable while processing
          >
            {isProcessing ? "Processing..." : "Confirm Booking & Pay"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;