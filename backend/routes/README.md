# API Routes (`/routes`)

This directory defines all the API endpoints for the application. Each file corresponds to a major resource (e.g., `movies`, `users`, `auth`) and maps specific HTTP routes (like `GET /movies/explore`) to their respective controller functions.

These routes are the "entry points" to the backend. They are responsible for applying middlewares (like authentication or file uploads) before passing the request to the controller for logic processing.

## File Breakdown

### `admin.js`
* **Base Path**: `/api/admin` (Assumed)
* **Purpose**: Defines all routes for the Admin Dashboard. These routes are protected by the `isAdmin` middleware (applied in `app.js`) and cover all **CRUD** operations for the application's core data.
* **Key Routes**:
    * `POST /movie`: Adds a new movie (handles file upload).
    * `GET /movie`: Gets a paginated list of all movies.
    * `PUT /movie/:id`: Updates a movie (handles file upload).
    * `GET /cities`, `POST /cities`, `PUT /city/:id`, `DELETE /cities/:id`: Full CRUD for cities.
    * `GET /cinemas`, `POST /cinemas`, `PUT /cinema/:id`, `DELETE /cinemas/:id`: Full CRUD for cinemas (theaters).
    * `GET /cinema-halls`, `POST /cinema-halls`, `PUT /cinema-hall/:id`, `DELETE /cinema-halls/:id`: Full CRUD for cinema halls.
    * `GET /view-shows`, `POST /shows`, `PUT /shows/:id`, `DELETE /shows/:id`: Full CRUD for shows.
    * `GET /users`: Gets a list of all users.
    * `PUT /users/:id/toggle-admin`: Promotes/demotes a user.
    * `DELETE /reviews/:id`: Deletes a user-submitted review.
    * `GET /bookings/search`: Finds bookings by ID, email, or phone.
    * `PUT /bookings/:id/cancel`: Cancels a user's booking.
    * `GET /analytics/*`: A set of routes to power the analytics dashboard (KPIs, revenue charts, etc.).

### `auth.js`
* **Base Path**: `/api/auth` (Assumed)
* **Purpose**: Handles all authentication, registration, and password-reset logic.
* **Key Routes**:
    * `POST /send-otp`: Sends an OTP for registration or password reset.
    * `POST /verify-otp`: Verifies a submitted OTP.
    * `POST /register`: Registers a new user (requires a verified OTP).
    * `POST /login`: Logs a user in and creates a session.
    * `GET /logout`: Destroys the user's session.
    * `POST /reset-password`: Resets a user's password (requires a verified OTP).

### `users.js`
* **Base Path**: `/api/users` (Assumed)
* **Purpose**: Manages a logged-in user's own profile. All routes are protected by the `isAuthenticated` middleware.
* **Key Routes**:
    * `GET /me`: Gets the current logged-in user's profile data.
    * `PUT /update-profile`: A single endpoint to update name, email, and phone.
    * `PUT /update-password`: Updates the user's password (requires current password).
    * `DELETE /me`: Deletes the user's own account.

### `movies.js`
* **Base Path**: `/api/movies` (Assumed)
* **Purpose**: Handles public-facing movie discovery and reviews.
* **Key Routes**:
    * `GET /explore`: A flexible endpoint to find movies (e.g., by city).
    * `GET /cities`: Gets a simple list of all cities.
    * `GET /search`: Powers the main search bar for movies and theaters.
    * `GET /:movieId/reviews`: Gets all reviews for a movie.
    * `POST /:movieId/reviews`: Adds a new review for a movie (protected route).

### `theater.js`
* **Base Path**: `/api/theater` (Assumed)
* **Purpose**: Handles finding theaters and their showtimes.
* **Key Routes**:
    * `GET /lookup`: A flexible endpoint to find theaters (e.g., by movie, date, and city) or get details for a single theater.

### `show.js` & `seat.js`
* **Base Paths**: `/api/show` & `/api/seat` (Assumed)
* **Purpose**: These routes work together to provide the seat selection map.
* **Key Routes**:
    * `GET /seat/show/:showid`: (Formerly `/show/:showId/seats`) Gets the complete, detailed seat map for a specific show, including prices and availability.
    * `POST /show/filter`: Finds shows for a specific movie at a specific theater on a given date.

### `bookings.js`
* **Base Path**: `/api/bookings` (Assumed)
* **Purpose**: Manages the user's booking workflow (pre-payment).
* **Key Routes**:
    * `POST /summary`: Gets a booking summary (price, seats) before payment.
    * `POST /confirm`: Creates a "Pending" booking and places a temporary hold on the seats.
    * `GET /user/:userId/orders`: Fetches all of a user's past bookings (order history).

### `payment.js`
* **Base Path**: `/api/payment` (Assumed)
* **Purpose**: Handles the final payment processing step.
* **Key Routes**:
    * `POST /process`: Receives payment confirmation, finalizes the seat booking, and updates the booking status to "Confirmed".