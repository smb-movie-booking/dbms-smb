## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── bookingController.js
│   ├── movieController.js
│   └── userController.js
├── models/
│   ├── bookingModel.js
│   ├── movieModel.js
│   └── userModel.js
├── routes/
│   ├── bookings.js
│   ├── movies.js
│   └── users.js
├── utils/
├── app.js
├── .env
└── .env.example
```

## 🔐 Auth Module

Handles registration, login, session management, and user profiles.

**Key Files:**
- `controllers/userController.js`: Auth logic, user management
- `routes/users.js`: Auth and user routes
- `models/userModel.js`: User schema/model

**Routes:**
```
POST /register  
POST /login  
GET /logout  
GET /profile 
```

---

## 🎬 Movies

Manage movies: list, details, admin CRUD.

**Key Files:**
- `controllers/movieController.js`: Movie logic
- `routes/movies.js`: Movie routes
- `models/movieModel.js`: Movie schema/model

**Routes:**
```
GET /movies  
GET /movies/:id  
POST /movies        // admin only  
PUT /movies/:id     // admin only  
DELETE /movies/:id  // admin only
```

---

## 🏢 Theaters & Screens

**Sample Routes:**
```
GET /theaters  
GET /theaters/:id  
POST /theaters       // admin  
PUT /theaters/:id    // admin  
DELETE /theaters/:id // admin
```

---

## ⏰ Shows

**Sample Routes:**
```
GET /shows?movieId=...&date=...  
POST /shows          // admin  
PUT /shows/:id       // admin  
DELETE /shows/:id    // admin
```

---

## 🪑 Seats & Booking

Live seat view and booking logic.

**Key Files:**
- `controllers/bookingController.js`: Booking logic
- `routes/bookings.js`: Booking routes
- `models/bookingModel.js`: Booking schema/model

**Routes:**
```
GET /seats/:showId  
POST /book           // Book seat(s)
```

---

## 📜 Bookings

User's booking history and booking details.

**Routes:**
```
GET /bookings/user/:userId  
GET /bookings/:id
```

---

## ⚙️ Admin

Special protected routes for dashboard features.

**Sample Routes:**
```
GET /admin/users  
GET /admin/bookings  
GET /admin/dashboard
```

---

## 🛡️ Middleware Protection

- `isAuthenticated`: Protects any route that needs login
- `isAdmin`: Protects admin routes

---

## ⚙️ Configuration

- `config/db.js`: Sets up database connection (e.g., MongoDB)
- `.env` / `.env.example`: Store environment variables

---

## 🛠️ Utilities

- `utils/`: General helper functions

---

## 🚀 Getting Started

1. Copy `.env.example` to `.env` and fill in your values.

---
