## 📁 Folder Structure

```
backend/
├── config/                 # Configuration (e.g. DB, sessions)
│   └── db.js
│
├── controllers/           # Route logic (business layer)
│   ├── authController.js
│   ├── movieController.js
│   ├── theaterController.js
│   ├── showController.js
│   ├── bookingController.js
│   └── seatController.js
│
├── middlewares/           # Auth, logging, error handlers
│   ├── isAuthenticated.js
│   └── isAdmin.js
│
├── models/                # DB models/queries
│   ├── userModel.js
│   ├── movieModel.js
│   ├── theaterModel.js
│   ├── showModel.js
│   ├── bookingModel.js
│   └── seatModel.js
│
├── routes/                # Route definitions
│   ├── authRoutes.js
│   ├── movieRoutes.js
│   ├── theaterRoutes.js
│   ├── showRoutes.js
│   ├── bookingRoutes.js
│   └── adminRoutes.js
│
├── .env                   # Environment variables
├── app.js                 # Entry point
└── package.json           # NPM metadata & scripts
```
---

## 📦 Modules Overview

This backend follows a modular MVC structure. Each module encapsulates a key domain of the system such as authentication, movies, theaters, shows, bookings, and admin operations.

---

### 🔐 Auth Module

Handles user authentication and profile management.

**Key Files:**
- `controllers/authController.js` – Authentication logic
- `routes/authRoutes.js` – Auth-related API routes
- `models/userModel.js` – User schema/model
- `middlewares/isAutenticated.js` - Login Check

**Endpoints:**
```
POST   /api/auth/register     # Register a new user
POST   /api/auth/login        # User login
GET    /api/auth/logout       # Logout the current session
GET    /api/auth/profile      # Get current user info
```

---

### 🎬 Movie Module

Manage movie listings, view movie details, and perform admin-level CRUD.

**Key Files:**
- `controllers/movieController.js`
- `routes/movieRoutes.js`
- `models/movieModel.js`

**Endpoints:**
```
GET    /api/movies            # List all movies
GET    /api/movies/:id        # Get movie by ID
POST   /api/movies            # Add a movie (admin)
PUT    /api/movies/:id        # Update a movie (admin)
DELETE /api/movies/:id        # Delete a movie (admin)
```

---

### 🏢 Theater Module

Create, update, or delete theaters, and fetch theater info.

**Key Files:**
- `controllers/theaterController.js`
- `routes/theaterRoutes.js`
- `models/theaterModel.js`

**Endpoints:**
```
GET    /api/theaters          # Get all theaters
GET    /api/theaters/:id      # Get theater by ID
POST   /api/theaters          # Add a theater (admin)
PUT    /api/theaters/:id      # Edit a theater (admin)
DELETE /api/theaters/:id      # Remove a theater (admin)
```

---

### ⏰ Show Module

Manage showtime schedules for movies in specific theaters.

**Key Files:**
- `controllers/showController.js`
- `routes/showRoutes.js`
- `models/showModel.js`

**Endpoints:**
```
GET    /api/shows             # Filter shows by movie/date
POST   /api/shows             # Add a new showtime (admin)
PUT    /api/shows/:id         # Update showtime (admin)
DELETE /api/shows/:id         # Remove showtime (admin)
```

---

### 🪑 Seats & Booking Module

Handles live seat availability, seat mapping, and ticket booking.

**Key Files:**
- `controllers/seatController.js`
- `controllers/bookingController.js`
- `routes/bookingRoutes.js`
- `models/seatModel.js`
- `models/bookingModel.js`

**Endpoints:**
```
GET    /api/seats/:showId            # Get available seats for a show
POST   /api/bookings                 # Book seats
GET    /api/bookings/user/:userId    # View user's booking history
GET    /api/bookings/:id             # View specific booking (user/admin)
```

---

### ⚙️ Admin Module

Provides access to protected admin operations and dashboard analytics.

**Key Files:**
- `routes/adminRoutes.js`
- `middlewares/isAdmin.js`

**Endpoints:**
```
GET    /api/admin/users              # List all users
GET    /api/admin/bookings           # View all bookings
GET    /api/admin/dashboard          # Admin dashboard data
```
---

### 🛡️ Middleware Protection

Custom middleware for route-level protection.

- `isAuthenticated.js`: Validates login/auth tokens
- `isAdmin.js`: Ensures admin privileges

**Usage Example:**
```js
router.use('/api/admin', isAuthenticated, isAdmin);
```

---

### ⚙️ Configuration

- `config/db.js`: MongoDB or DB connection setup
- `.env` / `.env.example`: Store secret credentials and configs

---
 #### *Payment, image upload, review modules will be implemented later*
