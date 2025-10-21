import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axios";
import { useContext } from "react";
import { Auth } from "../../Context/AuthContext";

const PaymentPage = () => {
  const location = useLocation();
  const {authUser}=useContext(Auth);
  const navigate = useNavigate();
  const { showId, seatInfo = {}, selectedSeats = { seats: [], totalPrice: 0 } } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("card");

  const handlePayment = async() => {
    if(!authUser?.user?.id || !showId || selectedSeats.seats.length===0){
      return
    }

    const paymentInfo={
      userId:authUser.user.id,
      showId,
      seatSelections:selectedSeats.seats,
    }
    console.log(selectedSeats.seats);
    toast.success("Payment successful!");
    try {
      const {data}=await axiosInstance.post('/api/booking/confirm', paymentInfo);
      console.log("Booking confirmed:", data);
    } catch (error) {
      
    }
    // In real app, call backend payment API here
    navigate("/");
  };

  if (!location.state) {
    toast.error("Payment data missing!");
    navigate("/");
    return null;
  }

  return (
    <div className="payment-container">
      <h2>Payment Gateway</h2>
      <p><strong>Total Amount:</strong> ₹{selectedSeats?.totalPrice}</p>

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
