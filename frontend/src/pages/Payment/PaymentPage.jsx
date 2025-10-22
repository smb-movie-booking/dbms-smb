import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import toast from "react-hot-toast";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { total, seatInfo, selectedSeats } = state || {};

  const [paymentMethod, setPaymentMethod] = useState("card");

  const handlePayment = () => {
    toast.success("Payment successful!");
    // In real app, call backend payment API here
    navigate("/");
  };

  if (!state) {
    toast.error("Payment data missing!");
    navigate("/");
    return null;
  }

  return (
    <div className="payment-container">
      <h2>Payment Gateway</h2>
      <p><strong>Total Amount:</strong> ₹{total}</p>

      <div className="payment-methods">
        <label>
          <input
            type="radio"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Credit / Debit Card
        </label>
        <label>
          <input
            type="radio"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          UPI
        </label>
        <label>
          <input
            type="radio"
            value="netbanking"
            checked={paymentMethod === "netbanking"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Net Banking
        </label>
      </div>

      <button className="register-btn" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
