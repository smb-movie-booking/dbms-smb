# Controllers (`/controllers`)

This directory contains the "brains" of the backend application. Each controller file is responsible for handling the business logic for a specific resource (like "movies" or "users").

They act as the middle layer between the **Routes** (which define the API endpoints) and the **Models** (which interact with the database). A controller function receives a request, uses models to fetch or save data, and then sends a response back to the client.

## Files

### `adminController.js`

Handles all logic for the Admin Dashboard. This is the largest controller and is responsible for all **CRUD** (Create, Read, Update, Delete) operations on core data, including:

* Cities, Cinemas (Theaters), and Cinema Halls
* Movies and Shows (including pricing)
* User management (viewing users, toggling admin status)
* Booking management (searching and cancelling bookings)
* Review management (deleting reviews)
* Analytics (fetching KPIs and reports for the dashboard)

### `authController.js`

Manages user authentication and registration.

* `login`: Handles user login with email/phone and password.
* `register`: Creates a new user after verifying their OTP.
* `logout`: Destroys the user's session.
* `resetPassword`: Updates a user's password after a successful OTP verification.

### `userController.js`

Manages a logged-in user's own profile.

* `getProfile`: Gets the current user's data from their session.
* `updateProfile`: Handles updates to a user's name, email, or phone.
* `updatePassword`: Allows a logged-in user to change their password by providing their current one.
* `deleteProfile`: Allows a user to delete their own account.

### `otpController.js`

Manages the One-Time Password (OTP) system.

* `sendOTP`: Generates a 6-digit OTP, saves it to the database with an expiration time, and (simulates) sending it.
* `verifyOTP`: Checks if a provided OTP matches the one in the database and is not expired.

### `movieController.js`

Handles public-facing logic for discovering movies.

* `handleExplore`: A flexible function that finds movies based on different criteria (e.g., by city, by theater).
* `getCities`: Returns a simple list of all available cities.
* `getMoviesBySearch`: Powers the search bar, finding movies and theaters that match a search string.

### `theaterController.js`

Handles public-facing logic for finding theaters.

* `handleTheaterLookup`: Finds theaters playing a specific movie on a given date/city, or simply lists all theaters in a city.

### `showController.js`

Handles public-facing logic for finding specific showtimes.

* `getShowsByMovieTheaterDate`: Fetches all available showtimes for a single movie at a single theater on a specific date.

### `seatController.js`

Manages the seat selection process for a user.

* `getSeatsByShowId`: Fetches the complete seat map for a specific show, including seat type, price, and availability (Booked, Available, etc.).

### `bookingController.js`

Manages the user-facing booking workflow.

* `getBookingSummary`: Provides a price and details summary *before* the user pays.
* `confirmBooking`: Creates a new booking, places a temporary "hold" on the selected seats, and returns a `bookingId`.
* `getOrderDetails`: Fetches a list of all past bookings for a user.

### `paymentController.js`

Handles the final step of a booking after payment is received.

* `processPayment`: Marks a booking as "Confirmed" (Status=2), finalizes the seat reservation, and creates a payment record in the database.

### `reviewController.js`

Manages user-submitted reviews for movies.

* `getReviews`: Fetches all reviews for a specific movie.
* `addReview`: Allows a logged-in user to post a new review.