// frontend/src/components/PaymentModal/PaymentModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PaymentModal.css';

export default function PaymentModal({ bookingId, amount, seatIds = [], onSuccess, onCancel }) {
  // 5-minute timer (in seconds) - you can reduce for testing
  const INITIAL_SECONDS = 5 * 60; // change to 60 for quicker tests
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(t);
          // Timer expired — treat as cancel
          handleCancel(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  const handlePayNow = async () => {
    setProcessing(true);
    try {
      // Simulated payment details — in real life you'd collect card info
      const payload = {
        bookingId,
        amount,
        seatIds,
        paymentMethod: {
          type: 'simulated',
          provider: 'mock-gateway',
          txnRef: `SIM-${Date.now()}`
        }
      };
      const resp = await axios.post('/api/payment/process', payload);
      // expecting success response
      if (resp.status === 200) {
        onSuccess();
      } else {
        alert('Payment failed. Please try again.');
      }
    } catch (err) {
      console.error('payment error', err);
      alert('Payment failed due to server error.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = (byTimeout=false) => {
    // On cancel, simply call onCancel — backend has rollback/job to release holds
    if (byTimeout) {
      alert('Payment time expired. Your booking has been cancelled.');
    }
    onCancel();
  };

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal">
        <h3>Simulated Payment</h3>
        <p>Amount to pay: <strong>₹{amount.toFixed(2)}</strong></p>
        <p>Booking ID: {bookingId}</p>
        <p>Time left: <strong>{formatTime(secondsLeft)}</strong></p>

        <div className="payment-actions">
          <button onClick={handlePayNow} disabled={processing}>
            {processing ? 'Processing...' : `Pay ₹${amount.toFixed(2)} Now`}
          </button>
          <button onClick={() => handleCancel(false)} disabled={processing}>
            Cancel Payment
          </button>
        </div>

        <div style={{marginTop:10, fontSize:12, color:'#555'}}>
          This is a simulated gateway for demo/testing only.
        </div>
      </div>
    </div>
  );
}
