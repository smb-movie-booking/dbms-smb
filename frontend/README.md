# Boxoffice Frontend

This is the frontend client for the Boxoffice application. It is a modern **React** application built with **Vite** that provides a fast, responsive user interface for browsing movies, booking tickets, and managing the application as an administrator.

It consumes the RESTful API provided by the `/backend` service.

## ✨ Key Features

* **Movie Discovery**: Browse and search for movies currently playing in your city.
* **Theater Filtering**: Filter movies by theater, showtime, date, and more.
* **Interactive Seat Selection**: A visual seat map for selecting specific seats in a theater.
* **Full Booking Workflow**: A multi-step process for booking, summary, and payment.
* **User Authentication**: Secure user registration (with OTP), login, and profile management.
* **Order History**: Users can view all their past bookings.
* **Admin Dashboard**: A separate, protected area for admins to perform CRUD operations on movies, theaters, shows, and users, and to view analytics.
* **Protected Routes**: User and Admin routes are protected using React Context and custom hooks.

---

## 💻 Tech Stack

* **Framework**: React.js
* **Build Tool**: Vite
* **Routing**: React Router (Assumed, based on `pages` structure)
* **API Client**: Axios
* **State Management**: React Context (for Authentication)
* **Styling**: CSS (plain CSS modules/files)
* **Deployment**: Vercel

---

## 📂 Project Structure

This is the high-level architecture of the frontend application.

```

/frontend
│
├── /public/                \# Static assets (logo-smb.png, M.png, etc.)
│   ├── logo-smb.png
│   └── vite.svg
│
├── /src/                   \# Main application source code
│   ├── /assets/            \# React-specific assets
│   ├── /components/        \# Reusable UI components (Navbar, Sidebar, Skeleton, etc.)
│   ├── /Context/           \# React Context for global state (AuthContext.jsx)
│   ├── /hooks/             \# Custom React hooks (useAuth, useDebounce, etc.)
│   ├── /pages/             \# Top-level page components (Home, Login, SeatSelect, Admin/\*)
│   │   ├── Admin/          \# Admin Dashboard pages
│   │   ├── Home/
│   │   ├── Login/
│   │   ├── SeatSelect/
│   │   └── ...
│   ├── /utils/             \# Utility functions (e.g., axios.js configured instance)
│   │   └── axios.js
│   ├── App.jsx             \# Main app component (handles routing)
│   ├── main.jsx            \# React app entry point
│   └── index.css           \# Global styles
│
├── .eslint.config.js       \# Code linting rules
├── index.html              \# HTML entry point for Vite
├── package.json            \# Project dependencies and scripts
├── vercel.json             \# Vercel deployment configuration
└── vite.config.js          \# Vite build tool configuration

````


## 🚀 Setup & Installation

Follow these steps to run the frontend server locally.

### 1. Install Dependencies
Navigate to the `frontend` directory and install the required npm packages.
```bash
cd frontend
npm install
````

### 2\. Configure Environment Variables

Create a file named `.env.local` in the `frontend` directory. This file is for local development and should not be committed to Git.

It must contain the URL of the running backend server:

```.env
# The full URL to your backend API
VITE_API_URL=http://localhost:3000/api
```

### 3\. Run the Development Server

Once your `.env.local` file is configured and your backend is running, you can start the frontend:

```bash
npm run dev
```

The server will start (usually on `http://localhost:5173`) with hot-reloading enabled.

-----

## 📦 Available Scripts

  * **`npm run dev`**: Starts the Vite development server.
  * **`npm run build`**: Compiles and bundles the React app for production.
  * **`npm run preview`**: Serves the production build locally to test it before deploying.

<!-- end list -->