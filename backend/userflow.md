## 1. Successful Booking Flow (The "Happy Path")

This is the ideal path a user takes to book a ticket.

1.  **Seat Selection:** The user selects seats and clicks "Pay" on the **`SeatSelect.jsx`** page.
2.  **Navigate to Summary:** The frontend navigates to the **Booking Summary** page, passing the selected seat data.
3.  **User Confirmation:** The user reviews the details and clicks "Confirm Booking & Pay".
4.  **Hold Seats (Backend):** The frontend sends a `POST` request to **`/api/bookings/confirm`**.
    * The `bookingController` creates a **`Booking`** record with `Booking_Status = 1` (Pending).
    * It also updates the **`Show_Seat`** records, setting `Seat_Status = 1` (Held).
    * The backend responds with a `bookingId`.
5.  **Simulated Payment:** The frontend receives the `bookingId` and opens the **Payment Modal**, starting a timer.
6.  **Process Payment (Backend):** The user clicks "Pay Now." The frontend sends a `POST` request to **`/api/payment/process`** with the `bookingId`, `seatIds`, and amount.
    * The `paymentController` creates a **`Payment`** record.
    * It updates the **`Booking`** record to `Booking_Status = 2` (Paid/Confirmed).
    * It updates the **`Show_Seat`** records to `Seat_Status = 2` (Booked).
7.  **Completion:** The backend responds with success. The frontend navigates the user to a "Booking Successful" page.

---
## 2. Failure Scenarios

These are the alternative paths when a booking is not completed.

### **Path A: User Abandons Booking**

This occurs if the user cancels the payment or the timer expires.

1.  **Hold Seats:** The user reaches step 4 of the successful flow, and a "Pending" booking is created on the backend.
2.  **User Cancels:** In the Payment Modal, the user clicks "Cancel Payment" or the timer runs out.
3.  **Frontend Action:** The frontend simply closes the modal and notifies the user. **No API call is made**.
4.  **Backend Cleanup:** The `Booking` record remains in the database with `Booking_Status = 1`. After 10 minutes, the **`cleanupService`** (cron job) finds this expired booking, updates its status to `4` (Expired), and releases the held seats (`Seat_Status = 0`).

### **Path B: Payment Fails on Backend**

This occurs if the user tries to pay, but an error happens on the server.

1.  **Attempt Payment:** The user reaches step 6 of the successful flow and the frontend calls `/api/payment/process`.
2.  **Backend Error:** An error occurs during the execution of the `paymentController.processPayment` function.
3.  **Rollback Logic:** The `catch` block in the controller is triggered.
    * It updates the **`Booking`** record to `Booking_Status = 3` (Cancelled).
    * It calls `bookingModel.releaseSeats` to set the **`Show_Seat`** status back to `0` (Available).
4.  **Frontend Action:** The backend responds with a server error. The frontend displays a "Payment Failed" message to the user.

### **Path C: Seat Conflict (Race Condition)**

This occurs if seats become unavailable while the user is on the summary page.

1.  **User Confirmation:** The user is on the summary page and clicks "Confirm Booking & Pay." The frontend calls `/api/bookings/confirm`.
2.  **Backend Conflict:** The `bookingController` calls `bookingModel.holdSeats`. However, another user has just booked one or more of the same seats, so their `Seat_Status` is no longer `0`.
3.  **Hold Fails:** The `holdSeats` function fails to secure the requested number of seats and returns an error or a count mismatch.
4.  **Backend Response:** The `bookingController` detects the failure and sends a conflict error (e.g., status code 409) back to the frontend.
5.  **Frontend Action:** The frontend receives the error and displays a message like, "Sorry, some seats are no longer available. Please select again."