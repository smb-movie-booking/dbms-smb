# Models (`/models`)

This directory is the data access layer (DAL) of the application. Each file, or "model," is responsible for all database interactions related to a single data entity (like `User` or `Movie`).

These models are called by the **Controllers**. They are the only part of the application that should directly execute SQL queries. They provide simple, reusable functions (e.g., `createUser`, `getMovieById`) to the rest of the application, hiding the raw SQL logic.

## Files

### `adminModel.js`
Handles database-wide administrative tasks.
* **Purpose**: Provides functions for the Admin Dashboard, such as reading the SQL schema file (`smb.sql`) to truncate all tables. It also contains helper functions for creating/finding cities, cinemas, and halls, and for checking show scheduling conflicts.

### `bookingModel.js`
Manages the entire booking life-cycle and transaction logic.
* **Purpose**: Provides functions to create a new booking, place a temporary "hold" on seats (`holdSeats`), finalize the booking after payment (`finalizeSeatsAfterPayment`), and release seats if a booking fails (`releaseSeats`). It also fetches details for the booking summary page (`getShowDetails`, `getSeatDetails`) and retrieves a user's complete order history (`getUserBookings`).

### `movieModel.js`
Handles fetching movie-related data for public discovery.
* **Purpose**: Provides functions to get the details of a single movie (`getMovieDetails`), find all movies playing in a specific city (`getMoviesByCity`), or find movies playing at a specific theater on a given date (`getMoviesByTheaterAndDate`).

### `otpModel.js`
Manages the One-Time Password (OTP) system for verification.
* **Purpose**: Responsible for creating, storing, retrieving, and validating OTPs (`createOrUpdateOTP`, `getOTP`). It tracks verification status (`isVerified`, `markAsVerified`) and handles expired OTPs.

### `reviewModel.js`
Manages user-submitted reviews for movies.
* **Purpose**: Provides functions to fetch all reviews for a specific movie (`getReviewsByMovie`) and to add a new review to the database (`addReview`).

### `seatModel.js`
Responsible for fetching the detailed seat map for a single show.
* **Purpose**: Contains the complex query (`fetchSeatsByShowId`) that joins multiple tables (`Movie_Show`, `Cinema_Seat`, `Show_Seat`, etc.) to build the complete seat layout for the frontend, including each seat's type, price, and status (available, booked, or blocked).

### `showModel.js`
Fetches showtime (Movie_Show) information.
* **Purpose**: Finds all available showtimes for a specific movie at a list of theaters (`getShowsByMovieAndTheaters`). This model includes logic to apply advanced filters for format, language, and time of day (e.g., "morning," "evening").

### `theaterModel.js`
Handles fetching theater (Cinema) data for public discovery.
* **Purpose**: Provides functions to find all theaters in a specific city (`getTheatersByCity`), get the detailed information for a single theater (`getTheaterDetails`), or find which theaters are playing a specific movie on a given date (`getTheatersByMovieAndDate`).

### `userModel.js`
Manages all data related to the `User` table.
* **Purpose**: Handles all user-centric database operations: creating a new user (`createUser`), finding users by ID, email, or phone (`getUserById`, `getByEmail`, `findByPhone`), and updating all parts of a user's profile (password, name, email, phone).