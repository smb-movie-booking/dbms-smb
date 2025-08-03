# Backend API Documentation & Frontend Guide

## 1. Project Overview

This document provides a comprehensive overview of the backend API for a user management system. The system handles user registration, login, session management, profile updates, and password resets, with a focus on OTP (One-Time Password) verification for key actions. It supports two user roles: standard users and administrators, distinguished by a secret code during registration.

**Backend Stack:**
- **Node.js/Express.js**: Server logic
- **bcrypt**: Password hashing
- **express-session**: Session management
- **dotenv**: Environment variables

---

## 2. API Endpoints

The API is logically divided into three main controllers:

- `auth`: Authentication-related endpoints
- `otp`: OTP management
- `users`: Authenticated user actions

### Authentication (`/api/auth`)

| Method | Endpoint         | Description                        | Request Body                                    | Success Response                               | Error Response                                                                                                                                 |
|--------|------------------|------------------------------------|------------------------------------------------|------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| POST   | `/login`         | Logs a user in                     | `{ "phone": "...", "password": "..." }`        | `{ "message": "User/Admin logged in successfully" }` | 400: Missing fields, invalid phone format. <br> 401: Invalid credentials.                                                                       |
| POST   | `/register`      | Registers a user after OTP verify  | `{ "name": "...", "phone": "...", "password": "...", "adminCode": "..." }` | `{ "message": "User/Admin registered & logged in" }` | 400: Missing fields. <br> 403: Phone not verified via OTP. <br> 500: Hashing/DB error.                   |
| GET    | `/logout`        | Logs out user                      | (None)                                         | `"Logged out"`                                  | 500: Error logging out                                                                                                                         |
| POST   | `/reset-password`| Resets password using OTP          | `{ "phone": "...", "otp": "...", "newPassword": "..." }` | `{ "message": "Password reset successfully" }`  | 400: Missing fields, invalid phone, OTP expired. <br> 401: Invalid OTP. <br> 500: Hashing/DB error.      |

---

### OTP Management (`/api/otp`)

| Method | Endpoint         | Description               | Request Body                      | Success Response                               | Error Response                                                                                                                  |
|--------|------------------|---------------------------|----------------------------------|------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------|
| POST   | `/send-otp`      | Sends OTP to phone/email  | `{ "identifier": "..." }`        | `{ "message": "OTP sent to phone/email (console)" }` | 400: Invalid format. <br> 409: Identifier already registered. <br> 500: DB error.                       |
| POST   | `/verify-otp`    | Verifies the OTP          | `{ "identifier": "...", "otp": "..." }` | `{ "message": "OTP verified successfully" }`    | 400: Missing fields, OTP not found. <br> 401: Invalid OTP. <br> 500: DB error.                          |

---

### User Profile (`/api/users`)

> All endpoints below require an active user session.

| Method | Endpoint              | Description                         | Request Body                                    | Success Response                               | Error Response                                                                                                                    |
|--------|-----------------------|-------------------------------------|------------------------------------------------|------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------|
| GET    | `/me`                 | Fetch user profile                  | (None)                                         | `{ "user": { ... } }`                          | 401: Not authenticated                                                                                                           |
| PUT    | `/update-password`    | Update password                     | `{ "currentPassword": "...", "newPassword": "...", "confirmPassword": "..." }` | `{ "message": "Password updated successfully" }` | 400: Missing fields, mismatch. <br> 401: Incorrect current password. <br> 500: DB error. |
| PUT    | `/update-name`        | Update user's name                  | `{ "name": "..." }`                            | `{ "message": "Name updated successfully" }`    | 400: Name required. <br> 500: Update failed.                                                                                     |
| PUT    | `/update-phone`       | Update phone (after OTP verify)     | `{ "phone": "...", "otp": "..." }`             | `{ "message": "Phone number verified and updated successfully" }` | 400: Missing fields, expired OTP. <br> 401: Invalid OTP. <br> 409: Phone already in use. <br> 500: DB error. |
| PUT    | `/update-email`       | Update email (after OTP verify)     | `{ "email": "...", "otp": "..." }`             | `{ "message": "Email updated successfully" }`   | 400: Missing fields, expired OTP. <br> 401: Invalid OTP. <br> 409: Email already in use. <br> 500: DB error. |
| DELETE | `/me`                 | Delete user account                 | (None)                                         | `{ "message": "Profile deleted successfully" }` | 401: Not authenticated. <br> 500: Deletion failed.                                                                               |

---

## 3. Frontend UI/UX Approach

### 3.1. Registration Flow (Multi-Step)

- **Step 1: Phone Verification**
  - UI: Phone input field
  - Action: `POST /api/otp/send-otp`
  - Feedback: "OTP sent", then reveal OTP input

- **Step 2: Complete Registration**
  - UI: Inputs for Name, Password, Admin Code (optional), and OTP
  - Action:
    - `POST /api/otp/verify-otp`
    - On success: `POST /api/auth/register`
  - UX: Redirect to dashboard/profile after auto-login

---

### 3.2. Login & Session Management

- UI: Form with Phone and Password
- Action: `POST /api/auth/login`
- State Management:
  - Store session status (React context, Redux, etc.)
  - Use to render protected routes/UI
  - Show appropriate nav controls ("Login" → "Logout")

---

### 3.3. Password Reset Flow (Multi-Step)

- **Step 1: Request Reset**
  - UI: Phone input
  - Action: `POST /api/otp/send-otp`

- **Step 2: Verify & Update**
  - UI: OTP and new password input
  - Action: `POST /api/auth/reset-password`
  - Feedback: On success, redirect to login

---

### 3.4. User Profile Page

- On load: `GET /api/users/me`

#### Components:

- **Display Info**: Name, Phone, Email
- **Update Name**:
  - Input + Save button → `PUT /api/users/update-name`
- **Update Password**:
  - Inputs for Current, New, Confirm → `PUT /api/users/update-password`
- **Update Phone/Email (Modal Flow Recommended)**:
  - Modal form:
    - New phone/email → `POST /api/otp/send-otp`
    - OTP input → `PUT /api/users/update-phone` or `update-email`
    - On success: close modal and `GET /api/users/me`
- **Delete Profile**:
  - Confirmation modal → `DELETE /api/users/me`

---

### 3.5. Error Handling

- Display error messages returned from API
- Examples:
  - Login 401 → "Invalid credentials."
  - Register 409 on `send-otp` → "Phone number already registered."

---

## 4. Setup & Environment

### Dependencies

Install required npm packages:

```bash
npm install express bcrypt express-session dotenv mysql
