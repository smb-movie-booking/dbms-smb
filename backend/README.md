# Boxoffice Backend Service

This directory contains the complete backend API for the Boxoffice application. It is a **Node.js / Express.js** server that handles all business logic, user authentication, database interactions, and administrative tasks.

This server exposes a RESTful API that the `frontend` application consumes.

## ✨ Key Features

* **Session-Based Authentication**: Secure user login, registration, and profile management using `express-session` with a MySQL store.
* **OTP Verification**: Robust OTP system for user registration and password resets.
* **Role-Based Access Control**: Distinct routes and permissions for regular users and administrators (`isAuthenticated`, `isAdmin` middlewares).
* **Full Admin Dashboard**: Complete CRUD (Create, Read, Update, Delete) functionality for:
    * Movies
    * Theaters (Cinemas)
    * Cinema Halls
    * Showtimes
    * Cities
* **Analytics & Reporting**: Admin-only endpoints for fetching KPIs, revenue over time, and top-performing movies/theaters.
* **Transactional Booking System**: A multi-step booking process that "holds" seats temporarily and "confirms" them after successful payment.
* **Background Cron Job**: An automated service (`cleanupService.js`) that runs every minute to release expired "held" seats, preventing deadlocks.
* **Cloud Image Uploads**: Integrates with `multer` and `cloudinary` for seamless uploading of movie posters.

---

## 💻 Tech Stack

* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: MySQL (using the `mysql2` driver)
* **Authentication**: `express-session` (with `express-mysql-session` for storage)
* **Password Hashing**: `bcrypt`
* **File Uploads**: `multer` & `cloudinary`
* **Scheduled Jobs**: `node-cron`
* **Environment**: `dotenv`
* **CORS**: `cors`

---


## 📂 Project Structure

This is the high-level architecture of the backend service.
````

/backend
│
├── app.js                \# Main server entry point
├── package.json          \# Project dependencies
│
├── config/               \# Database connection & SSL
│   ├── db.js
│   └── ca.pem
│
├── controllers/          \# Business logic for each route
│   ├── adminController.js
│   ├── authController.js
│   ├── bookingController.js
│   ├── movieController.js
│   ├── otpController.js
│   ├── paymentController.js
│   ├── reviewController.js
│   ├── seatController.js
│   ├── showController.js
│   ├── theaterController.js
│   └── userController.js
│
├── middlewares/          \# Request handlers (auth, file uploads)
│   ├── isAdmin.js
│   ├── isAuthenticated.js
│   └── multer.js
│
├── models/               \# Database query functions (Data Access Layer)
│   ├── adminModel.js
│   ├── bookingModel.js
│   ├── movieModel.js
│   ├── otpModel.js
│   ├── reviewModel.js
│   ├── seatModel.js
│   ├── showModel.js
│   ├── theaterModel.js
│   └── userModel.js
│
├── routes/               \# API endpoint definitions
│   ├── admin.js
│   ├── auth.js
│   ├── bookings.js
│   ├── movies.js
│   ├── payment.js
│   ├── seat.js
│   ├── show.js
│   ├── theater.js
│   └── users.js
│
├── utils/                \# Helper scripts & background services
│   ├── cleanupService.js
│   ├── cloudinary.js
│   └── parse.js
│
└── uploads/              \# (Empty) Folder for locally uploaded images (if not using cloud)

````

---

## 🚀 Setup & Installation

Follow these steps to run the backend server locally.

### 1. Install Dependencies

Navigate to the `backend` directory and install the required npm packages.

```bash
cd backend
npm install
````

### 2\. Set up the Database

This project requires a MySQL database.

1.  Ensure you have a MySQL server running.
2.  Create a new database (e.g., `smb_db`).
3.  Import the database schema by executing the `/database/smb.sql` file.
4.  (Optional) Run `/database/populate.sql` or `/database/insert.sql` to add sample data.

### 3\. Configure Environment Variables

Create a file named `.env` in the `backend` directory and add the following variables.

```.env
# Server
NODE_ENV=development
PORT=3000

# Database Connection
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=smb_db
PORT=3306

# Session
SESSION_SECRET=a_very_strong_secret_key_here

# Admin
ADMIN_SECRET=your_secret_admin_code

# Cloudinary (for image uploads)
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Note**: For production (`NODE_ENV=production`), the session cookie requires an HTTPS connection.

-----

## ▶️ Running the Server

Once your `.env` file is configured, you can start the server:

```bash
node app.js
```

The server will start, connect to the database, and begin the cron job.
You should see:
`🚀 Server running on http://localhost:3000`
`✅ Expired booking cleanup job scheduled to run every minute.`
