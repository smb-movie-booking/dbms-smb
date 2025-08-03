
# 📑 API Documentation – Authentication & User Profile

This document outlines the **backend API endpoints** for user authentication and user profile management. Each section includes endpoint details, expected request/response formats, and **UI/UX implementation notes** for frontend integration.

---

## 🔐 Authentication Routes (`auth.js`)

**Base Path:** `/api/auth`

---

### 1. POST `/login`

- **Description:** Log in a registered user.
- **Request Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "userpassword"
  }

* **Response:**

  * `200 OK`: Login successful, session initialized.
  * `401 Unauthorized`: Invalid credentials.

* **UX Guide:**

  * Store session or token.
  * Redirect to home.
  * Show error toast on failure.

---

### 2. POST `/register`

* **Description:** Register a new user account who completed phone verification.

* **Request Body:**

  ```json
  {
    "user_name": "Aadith",
    "email": "user@example.com",
    "password": "secret123",
    "phone": "9876543210"
  }
  ```
  *After phone verification all fields are sent with request*
* **Response:**

  * `200 OK`: User is registered and saved in db.
  * `409 Conflict`: Email or phone already registered.

* **UX Guide:**

  * Immediately redirects to home.

---

### 3. GET `/logout`

* **Description:** Logout the current session.

* **Response:**

  * `200 OK`: Session destroyed, user logged out.

* **UX Guide:**

  * Clear session/token from frontend.
  * Redirect to `/login`.

---

### 4. POST `/send-otp`

* **Description:** Send OTP to phone/email for verification. Used with updation of logged in profile, and registration of new profile.

* **Request Body:**

  ```json
  {
    "identifier": "9876543210" or "example@gmail.com"
  }
  ```

* **Response:**

  * `200 OK`: OTP sent.
  * `400 Bad Request`: Invalid or missing phone.

* **UX Guide:**

  * Show OTP countdown/resend timer.
  * Block further inputs until response.

---

### 5. POST `/verify-otp`

* **Description:** Verifies an OTP for a phone/email Called after inputing phone or email.

* **Request Body:**

  ```json
  {
    "identifier": "9876543210" or "example@gmail.com",
    "otp": "123456"
  }
  ```

* **Response:**

  * `200 OK`: OTP verified.
  * `400 Bad Request`: Incorrect or expired OTP.

* **UX Guide:**

  * Show confirmation UI on success.
  * Allow retry with limited attempts.

---

### 6. POST `/reset-password`

* **Description:** Reset password after verifying OTP.

* **Request Body:**

  ```json
  {
    "phone": "9876543210",
    "otp": "123456",
    "newPassword": "newpass123"
  }
  ```

* **Response:**

  * `200 OK`: Password updated.
  * `400 Bad Request`: OTP verification failed.

* **UX Guide:**

  * Redirect to login after success.
  * Show password reset confirmation screen.

---

## 👤 User Profile Routes (`user.js`)

**Base Path:** `/api/users`

All routes below require authentication via `isAuthenticated` middleware.

---

### 1. GET `/me`

* **Description:** Fetch current logged-in user's profile.

* **Response:**

  ```json
  {
    "id": 1,
    "user_name": "Aadith",
    "email": "user@example.com",
    "phone": "9876543210"
  }
  ```

* **UX Guide:**

  * Display profile in user dashboard.
  * Use this to verify session validity on page load.

---

### 2. PUT `/update-name`

* **Description:** Update the user's name.

* **Request Body:**

  ```json
  {
    "user_name": "New Name"
  }
  ```

* **UX Guide:**

  * Show success toast or inline feedback.
  * Refresh profile display.

---

### 3. PUT `/update-phone`

* **Description:** Update phone number (OTP verification required).

* **Request Body:**

  ```json
  {
    "newPhone": "9999999999",
    "otp": "123456"
  }
  ```

* **UX Guide:**

  * Show OTP prompt when user inputs new phone.
  * Verify and update with confirmation UI.

---

### 4. PUT `/update-email`

* **Description:** Update email address (OTP verification required).

* **Request Body:**

  ```json
  {
    "newEmail": "new@example.com",
    "otp": "123456"
  }
  ```

* **UX Guide:**

  * Trigger OTP verification after user submits new email.
  * Reflect updated email on dashboard.

---

### 5. PUT `/update-password`

* **Description:** Change password using current password for verification.

* **Request Body:**

  ```json
  {
    "currentPassword": "oldpass",
    "newPassword": "newpass123"
  }
  ```

* **UX Guide:**

  * Validate input locally for strength.
  * Notify user of success or failure.

---

### 6. DELETE `/me`

* **Description:** Permanently delete the user account.

* **Response:**

  * `200 OK`: Account deleted.

* **UX Guide:**

  * Ask for confirmation before sending the request.
  * Redirect to home or goodbye page after deletion.

---

## 🧩 Notes for Frontend (UI/UX Guide Summary)

| Feature          | UX Behavior                                                           |
| ---------------- | --------------------------------------------------------------------- |
| OTP Verification | Show modal/stepper after actions like register, phone/email change.   |
| Auth Errors      | Display toast or inline messages clearly on invalid input or failure. |
| Session Expiry   | Redirect to `/login` on `401` or `403` responses automatically.       |
| Profile Updates  | Use optimistic UI updates with rollback on error.                     |
| Resend OTP       | Enable after 30–60 seconds with cooldown.                             |

---

## 🛠️ Developer Tips

* Use tools like **Postman** or `curl` to test endpoints during development.
* Modularize middleware (like `isAuthenticated`) to secure sensitive routes.
* All OTP routes expect a valid `phone` or `email` as identifier.

---