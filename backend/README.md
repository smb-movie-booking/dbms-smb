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

## 🔐 Auth Module

Handles registration, login, logout, and user profile.

**Key Files:**
- `controllers/authController.js`: Auth logic
- `routes/authRoutes.js`: Auth routes
- `models/userModel.js`: User schema/model

**Routes:**
```
POST /api/auth/register  
POST /api/auth/login  
GET /api/auth/logout  
GET /api/auth/profile        // current user info
```

---

## 🎬 Movies

Manage movie listings, details, and admin controls.

**Key Files:**
- `controllers/movieController.js`
- `routes/movieRoutes.js`
- `models/movieModel.js`

**Routes:**
```
GET /api/movies  
GET /api/movies/:id  
POST /api/movies              // admin only  
PUT /api/movies/:id           // admin only  
DELETE /api/movies/:id        // admin only
```

---

## 🏢 Theaters

Create and manage theaters.

**Key Files:**
- `controllers/theaterController.js`
- `routes/theaterRoutes.js`
- `models/theaterModel.js`

**Routes:**
```
GET /api/theaters  
GET /api/theaters/:id  
POST /api/theaters            // admin only  
PUT /api/theaters/:id         // admin only  
DELETE /api/theaters/:id      // admin only
```

---

## ⏰ Shows

Showtime scheduling and retrieval.

**Key Files:**
- `controllers/showController.js`
- `routes/showRoutes.js`
- `models/showModel.js`

**Routes:**
```
GET /api/shows?movieId=...&date=...  
POST /api/shows               // admin only  
PUT /api/shows/:id            // admin only  
DELETE /api/shows/:id         // admin only
```

---

## 🪑 Seats & Booking

Live seat view, seat management, and booking.

**Key Files:**
- `controllers/seatController.js`
- `controllers/bookingController.js`
- `routes/bookingRoutes.js`
- `models/seatModel.js`, `bookingModel.js`

**Routes:**
```
GET /api/seats/:showId              // view available seats  
POST /api/bookings                  // user booking
GET /api/bookings/user/:userId      // user booking history  
GET /api/bookings/:id               // booking detail (user/admin)
```

---

## ⚙️ Admin

Admin-only features like dashboard, user data, analytics, etc.

**Key Files:**
- `routes/adminRoutes.js`
- `middlewares/isAdmin.js`

**Sample Routes:**
```
GET /api/admin/users  
GET /api/admin/bookings  
GET /api/admin/dashboard
```

---

## 🛡️ Middleware Protection

Custom middleware for route-level protection.

- `isAuthenticated.js`: Validates login/auth tokens
- `isAdmin.js`: Ensures admin privileges

**Usage Example:**
```js
router.use('/api/admin', isAuthenticated, isAdmin);
```

---

## ⚙️ Configuration

- `config/db.js`: MongoDB or DB connection setup
- `.env` / `.env.example`: Store secret credentials and configs

---
 #### *Payment and image upload modules will be implemented later*
