import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Assuming you will create BookingSummary.css later
import "./BookingSummary.css"; 
import toast from "react-hot-toast";

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Destructure with default values to prevent errors if state is missing bits
  const { showId, seatInfo = {}, selectedSeats = { seats: [], totalPrice: 0 } } = location.state || {};

  // More robust check
  if (!selectedSeats.seats || selectedSeats.seats.length === 0 || !seatInfo.title) {
    // Redirect immediately if essential data is missing
    React.useEffect(() => {
        toast.error("Booking details missing. Redirecting...", { duration: 1500 });
        const timer = setTimeout(() => navigate("/"), 1500); // Redirect after toast
        return () => clearTimeout(timer); // Cleanup timer
    }, [navigate]);
    return null; // Render nothing while redirecting
  }

  const total = selectedSeats.totalPrice;
  const movieTitle = seatInfo.title;
  const cinemaName = seatInfo.cinema;
  const showDate = seatInfo.showDate ? new Date(seatInfo.showDate).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : 'N/A';
  const startTime = seatInfo.startTime ? new Date(seatInfo.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A';

  return (
    <div className="booking-summary-page"> {/* Full page container */}
      <div className="booking-summary-card"> {/* Card container */}
        <h2 className="summary-title">Booking Summary</h2>

        {/* Movie and Show Details Section */}
        <div className="summary-section movie-details">
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

        {/* Seat Details Section */}
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

        {/* Total Price Section */}
        <div className="summary-section total-section">
          <h3 className="total-label">Grand Total:</h3>
          <span className="total-price">₹{parseFloat(total).toFixed(2)}</span>
        </div>

        {/* Payment Button */}
        <div className="payment-actions">
          <button
            className="proceed-button" // Changed class name
            onClick={() => navigate("/payment", { state: { showId, selectedSeats, seatInfo, total } })}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;