import React, { useState , useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axios"; // Assuming axios instance path

// --- SVG Icons (keep these as they are) ---
const VisaLogo = () => <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" style={{ height: '24px' }} />;
// ... other logo components ...
const MastercardLogo = () => <img src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg" alt="Mastercard" style={{ height: '24px' }} />;
const RupayLogo = () => <img src="https://upload.wikimedia.org/wikipedia/commons/c/cb/Rupay-Logo.png" alt="RuPay" style={{ height: '24px' }} />;
const GPayLogo = () => <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" style={{ height: '24px' }} />;
const PhonePeLogo = () => <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" style={{ height: '24px' }} />;
const PaytmLogo = () => ( /* Your preferred Paytm logo implementation */
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
     <path d="M12.93 17.388h-1.928v-3.32h1.928v-.76c0-1.896.79-3.085 2.873-3.085h1.983v3.132h-1.187c-.553 0-.66.19-.66.702v2.33h1.921l-.25 3.32h-1.671v8.831h-3.007v-8.831zm-9.358.204l-1.428-3.792c-.11-.25-.33-.421-.6-.421h-6c-.27 0-.5.171-.6.421l-1.428 3.792c-.08.239-.08.51 0 .75.11.25.33.421.6.421h8.857c.27 0 .5-.171.6-.421.08-.24.08-.51 0-.75zm-8.324-4.212h7.4l1.05 2.792h-9.5l1.05-2.792zm8.28 5.208h-9c-.3 0-.54.228-.54.51v9c0 .282.24.51.54.51h9c.3 0 .54-.228.54-.51v-9c0-.282-.24-.51-.54-.51zm-.81 8.188h-7.38v-7.5h7.38v7.5zm19.5-12.792h-5.687c-.3 0-.54.228-.54.51v15c0 .282.24.51.54.51h5.687c.3 0 .54-.228.54-.51v-15c0-.282-.24-.51-.54-.51zm-.81 14.188h-4.067v-13.5h4.067v13.5z"/>
   </svg>
);
// --- END SVG Icons ---

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  // Destructure state, including the new bookingId
  const { bookingId, total = 0, seatInfo = {}, selectedSeats = { seats: [] } } = state || {};

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedBank, setSelectedBank] = useState(null); // Keep this if using netbanking UI
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    // Exit early if timer reaches 0 or payment is processing
    if (timer <= 0 || isProcessing) return;

    // Set up the interval
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000); // Decrease every second

    // Cleanup function to clear interval
    return () => clearInterval(intervalId);

  }, [timer, isProcessing]);

  // Updated check to include bookingId
  React.useEffect(() => {
    if (!state || !bookingId || !total || !seatInfo.title) {
      toast.error("Payment details incomplete. Redirecting...", { duration: 1500 });
      const timer = setTimeout(() => navigate("/"), 1500);
      return () => clearTimeout(timer);
    }
  }, [state, bookingId, total, seatInfo, navigate]);

  // Guard clause
  if (!state || !bookingId || !total || !seatInfo.title) {
    return null;
  }

  // --- UPDATED PAYMENT HANDLER ---
  const handlePayment = async () => {
    setIsProcessing(true);
    toast.loading("Processing payment...");

    // Map frontend string to DB integer for PaymentMethod
    let paymentMethodCode;
    switch (paymentMethod) {
      case 'card': paymentMethodCode = 1; break;
      case 'upi': paymentMethodCode = 2; break;
      case 'netbanking': paymentMethodCode = 3; break;
      default: paymentMethodCode = 1; // Default to card
    }

    // Simulate a remote transaction ID
    const simulatedTxnId = `txn_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // Extract seat IDs needed by the backend to finalize
    const seatIds = selectedSeats.seats.map(s => s.showSeatId);

    try {
      // --- PHASE 2 API CALL ---
      await axiosInstance.post('/api/payment/process', {
        bookingId: bookingId,
        amount: total,
        paymentMethod: paymentMethodCode,
        remoteTransactionId: simulatedTxnId,
        discountCouponId: null, // Not implemented in this example
        seatIds: seatIds // Pass seat IDs to finalize
      });
      // --- END PHASE 2 ---

      toast.dismiss();
      toast.success("Payment successful! Your tickets are booked.", { duration: 3000 });
      // Navigate to a dedicated success page or home after a delay
      setTimeout(() => navigate("/"), 3000); // Redirect home after showing success

    } catch (err) {
      toast.dismiss();
      console.error("Payment processing failed:", err);
      // Backend handles rollback
      toast.error(err.response?.data?.message || "Payment failed. Your booking was cancelled. Please try again.");
      // Navigate back to summary or seat selection after showing error
      setTimeout(() => navigate(`/booking/summary`, { state: { showId: seatInfo.showId, seatInfo, selectedSeats } }), 3000); // Go back to summary
    } finally {
       // Only set processing to false if it didn't succeed to prevent double clicks after error
       // setIsProcessing(false); // Let the redirect handle the UI change
    }
  };
  // --- END UPDATED HANDLER ---

  const showDate = seatInfo.showDate ? new Date(seatInfo.showDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) : 'N/A';
  const startTime = seatInfo.startTime ? new Date(seatInfo.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A';

  return (
    <div className="payment-page">
      <div className="payment-layout">
        {/* --- Left Side: Payment Options (No changes needed here) --- */}
        <div className="payment-main">
          <div className="timer-display">
              Time left: {timer}s
            </div>

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
                    {/* Add onClick and conditional className */}
                    <div 
                        className={`bank-option ${selectedBank === 'SBI' ? 'selected-bank' : ''}`} 
                        onClick={() => setSelectedBank('SBI')}>
                        State Bank of India
                    </div>
                    <div 
                        className={`bank-option ${selectedBank === 'HDFC' ? 'selected-bank' : ''}`} 
                        onClick={() => setSelectedBank('HDFC')}>
                        HDFC Bank
                    </div>
                    <div 
                        className={`bank-option ${selectedBank === 'ICICI' ? 'selected-bank' : ''}`} 
                        onClick={() => setSelectedBank('ICICI')}>
                        ICICI Bank
                    </div>
                    <div 
                        className={`bank-option ${selectedBank === 'AXIS' ? 'selected-bank' : ''}`} 
                        onClick={() => setSelectedBank('AXIS')}>
                        Axis Bank
                    </div>
                    <div 
                        className={`bank-option ${selectedBank === 'KOTAK' ? 'selected-bank' : ''}`} 
                        onClick={() => setSelectedBank('KOTAK')}>
                        Kotak Mahindra Bank
                    </div>
                    {/* Make 'More Banks' look different or handle it separately */}
                    <div className="bank-option more-banks"> 
                        More Banks...
                    </div> 
                 </div>
             </div>
          )}
        </div>

        {/* --- Right Side: Order Summary (No changes needed here) --- */}
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
            {/* Display seat names */}
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