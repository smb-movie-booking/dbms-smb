import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BookingSummary.css";
import toast from "react-hot-toast";

const BookingSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showId, seatInfo, selectedSeats } = location.state || {};

  if (!selectedSeats || !seatInfo) {
    toast.error("Booking details missing. Please select seats again.");
    navigate("/");
    return null;
  }

  const total = selectedSeats.totalPrice;
  const movieTitle = seatInfo?.title || "Unknown Movie";
  const cinemaName = seatInfo?.cinema || "Unknown Cinema";

  return (
    <div className="booking-summary-container">
      <h2>Booking Summary</h2>
      <div className="summary-section">
        <p><strong>Movie:</strong> {movieTitle}</p>
        <p><strong>Cinema:</strong> {cinemaName}</p>
        <p><strong>Date:</strong> {new Date(seatInfo.showDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {new Date(seatInfo.startTime).toLocaleTimeString()}</p>
      </div>

      <div className="seat-summary">
        <h3>Selected Seats</h3>
        <ul>
          {selectedSeats.seats.map((s) => (
            <li key={s.seatId}>
              {s.seatName} - ₹{s.price}
            </li>
          ))}
        </ul>
        <h3>Total: ₹{total}</h3>
      </div>

      <div className="payment-actions">
        <button
          className="register-btn"
          onClick={() => navigate("/payment", { state: { showId, selectedSeats, seatInfo, total } })}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default BookingSummary;
