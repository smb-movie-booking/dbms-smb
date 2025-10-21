import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import toast from "react-hot-toast";

// --- SVG Icons for Payment Methods ---
// (These are simple representations. In a real app, you'd use official logo images)
const VisaLogo = () => <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '24px' }} />;
const MastercardLogo = () => <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" style={{ height: '24px' }} />;
const RupayLogo = () => <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" alt="RuPay" style={{ height: '24px' }} />;
const GPayLogo = () => <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" style={{ height: '24px' }} />;
const PhonePeLogo = () => <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" style={{ height: '24px' }} />;
const PaytmLogo = () => <img src="data:image/png;base64,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" alt="Paytm" style={{ height: '24px' }} />;

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { total = 0, seatInfo = {}, selectedSeats = { seats: [] } } = state || {};

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  React.useEffect(() => {
    if (!state || !total || !seatInfo.title) {
      toast.error("Payment details are missing. Redirecting...", { duration: 1500 });
      const timer = setTimeout(() => navigate("/"), 1500);
      return () => clearTimeout(timer);
    }
  }, [state, total, seatInfo, navigate]);

  if (!state || !total || !seatInfo.title) {
    return null;
  }

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Payment successful! Your tickets are booked.");
      navigate("/");
    }, 2000);
  };

  const showDate = seatInfo.showDate ? new Date(seatInfo.showDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) : 'N/A';
  const startTime = seatInfo.startTime ? new Date(seatInfo.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A';

  return (
    <div className="payment-page">
      <div className="payment-layout">
        <div className="payment-main">
          <h2 className="payment-title">Secure Payment</h2>
          <div className="payment-methods-tabs">
            <button className={`tab ${paymentMethod === 'card' ? 'active' : ''}`} onClick={() => setPaymentMethod('card')}>Credit/Debit Card</button>
            <button className={`tab ${paymentMethod === 'upi' ? 'active' : ''}`} onClick={() => setPaymentMethod('upi')}>UPI</button>
            <button className={`tab ${paymentMethod === 'netbanking' ? 'active' : ''}`} onClick={() => setPaymentMethod('netbanking')}>Net Banking</button>
          </div>

          {paymentMethod === 'card' && (
            <div className="payment-form card-form">
              <div className="card-logos">
                <VisaLogo />
                <MastercardLogo />
                <RupayLogo />
              </div>
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input type="text" placeholder="MM / YY" />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="password" placeholder="***" maxLength="3" />
                </div>
              </div>
               <div className="form-group">
                <label>Name on Card</label>
                <input type="text" placeholder="Enter name as on card" />
              </div>
            </div>
          )}
          
          {paymentMethod === 'upi' && (
             <div className="payment-form upi-form">
                <p>Pay with your favorite UPI app:</p>
                <div className="upi-apps">
                    <div className="upi-app"><GPayLogo /></div>
                    <div className="upi-app"><PhonePeLogo /></div>
                    <div className="upi-app"><PaytmLogo /></div>
                </div>
                <div className="or-divider"><span>OR</span></div>
                <div className="form-group">
                    <label>Enter UPI ID</label>
                    <input type="text" placeholder="yourname@bank" />
                </div>
             </div>
          )}

          {paymentMethod === 'netbanking' && (
             <div className="payment-form netbanking-form">
                 <p>Select from popular banks:</p>
                 <div className="bank-grid">
                    <div className="bank-option">State Bank of India</div>
                    <div className="bank-option">HDFC Bank</div>
                    <div className="bank-option">ICICI Bank</div>
                    <div className="bank-option">Axis Bank</div>
                    <div className="bank-option">Kotak Mahindra Bank</div>
                    <div className="bank-option">More Banks...</div>
                 </div>
             </div>
          )}

        </div>

        <div className="order-summary">
          <h3 className="summary-title-small">ORDER SUMMARY</h3>
          <div className="summary-section">
            <p className="movie-title">{seatInfo.title}</p>
            <p className="cinema-name">{seatInfo.cinema}</p>
            <p className="show-time">{showDate} at {startTime}</p>
          </div>
          <div className="summary-section">
            <div className="seats-header">
              <span>SEATS ({selectedSeats.seats.length})</span>
            </div>
            <p className="seat-names">{selectedSeats.seats.map(s => s.seatName).join(', ')}</p>
          </div>
          <div className="summary-total">
            <span className="total-label">Amount Payable</span>
            <span className="total-price">₹{parseFloat(total).toFixed(2)}</span>
          </div>
          <button className="pay-button" onClick={handlePayment} disabled={isProcessing}>
            {isProcessing ? (
              <div className="spinner"></div>
            ) : (
              `Pay ₹${parseFloat(total).toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;