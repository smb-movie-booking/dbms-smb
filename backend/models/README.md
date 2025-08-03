
---

# 🧠 Backend Model Documentation – User & OTP (Node.js + MySQL)

This document explains the backend logic for handling **user data** and **OTP (One-Time Password) verification** using MySQL. Each exported function from the model is explained with its **functionality**, **SQL logic**, and **integration suggestions for frontend developers (UI/UX guides).**


## 📦 OTP Model (`otpModel.js`)

The OTP table stores a one-time code sent to the user's **phone/email** for authentication and verification purposes.

### 📌 Table Structure: `OTP`

| Column       | Type         | Description                       |
|--------------|--------------|-----------------------------------|
| Identifier   | VARCHAR      | Phone or email (unique)           |
| OTP_Code     | VARCHAR      | 6-digit OTP                       |
| Expires_At   | DATETIME     | OTP expiration time               |
| Verified     | BOOLEAN      | Whether OTP has been verified     |

---

### 🔄 `createOrUpdateOTP(identifier, otp, expiresAt, callback)`

- **Purpose:** Insert a new OTP or update the existing unverified OTP for the same identifier.
- **SQL :**
  ```sql
  INSERT INTO OTP (...)
  ON DUPLICATE KEY UPDATE ... 
  ```


* **UX Guide:**

  * Show spinner while OTP is being generated.
  * Display toast: `"OTP sent to your phone/email."`
  * Block repeated submissions using cooldown timer (30s–60s).
  * Re-enable on backend success/failure.

---

### 🔍 `getOTP(identifier, callback)`

* **Purpose:** Fetch the latest unverified and non-expired OTP.
* **SQL Logic:** Ensures that expired or already verified OTPs are excluded.
* **UX Guide:**

  * Automatically called before verifying.
  * If no OTP found, prompt: `"Please request a new OTP."`

---

### ✅ `markAsVerified(identifier, callback)`

* **Purpose:** Mark OTP as used after successful verification.
* **Use Case:** Called after OTP verification on `/verify-otp`.
* **UX Guide:**

  * After verification, navigate to next step (e.g., dashboard or reset password screen).

---

### 🗑️ `deleteOTP(identifier, callback)`

* **Purpose:** Clean up OTPs for an identifier after use or expiry.
* **UX Guide:**

  * Typically used in backend cleanup, not directly user-facing.

---

### 📄 `isVerified(identifier, callback)`

* **Purpose:** Check whether an OTP was successfully verified.
* **Use Case:** Gate profile updates like phone/email change until verified.
* **UX Guide:**

  * If not verified, prompt user to complete verification.

---

## 👤 User Model (`userModel.js`)

This model handles all **CRUD operations** on the `User` table and password management logic.

### 📌 Table Structure: `User`

| Column         | Type     | Description                     |
| -------------- | -------- | ------------------------------- |
| UserID         | INT (PK) | Unique User ID                  |
| User\_Name     | VARCHAR  | User's display name             |
| User\_Password | VARCHAR  | Hashed password (bcrypt)        |
| Email          | VARCHAR  | Unique email                    |
| Phone          | VARCHAR  | Unique phone number             |
| IsAdmin        | BOOLEAN  | Admin role indicator (optional) |

---

### ➕ `createUser(name, hashedPassword, email, phone, isAdmin, callback)`

* **Purpose:** Register a new user with unique email and phone.
* **Logic:**

  * Auto-increments `UserID` manually (based on max ID).
  * Checks for duplicate phone numbers.
* **UX Guide:**

  * After OTP verification, call this function.
  * Show error if `DUPLICATE_PHONE` is returned.

---

### 🔎 `getByEmail(email, callback)`

* **Purpose:** Check if a user exists by email.
* **Use Case:** Login validation or registration duplication check.

---

### 🔎 `findByPhone(phone, callback)`

* **Purpose:** Find user by phone number.
* **Use Case:** Used in OTP login, reset password, and updates.

---

### 🔍 `findByEmailOrPhone(email, phone, callback)`

* **Purpose:** Check if a user exists using either field.
* **Use Case:** Prevent duplicate registration or lookup for login.

---

### 🔑 `getPasswordById(userId, callback)`

* **Purpose:** Retrieve stored password hash for validation.
* **Use Case:** Login or current password verification.
* **UX Guide:**

  * Compare hash in server logic using `bcrypt.compare()`.

---

### 👁️ `getUserById(userId, callback)`

* **Purpose:** Fetch user's public profile info.
* **Used In:** `/users/me` route for dashboard/profile display.
* **UX Guide:**

  * Use this to pre-fill profile edit forms.

---

### 📝 `updateUser(userId, name, phone, email, callback)`

* **Purpose:** Update profile details all at once.
* **Use Case:** Backend version of profile edit.
* **UX Guide:**

  * Display toast/alert on success.
  * Confirm phone/email changes only after OTP verification.

---

### 🗑️ `deleteUserById(userId, callback)`

* **Purpose:** Remove user account completely.
* **UX Guide:**

  * Confirm with user before sending request.
  * Redirect to farewell page or home after deletion.

---

### 🔁 `updatePassword(userId, newHashedPassword, callback)`

* **Purpose:** Change password after login (using current password).
* **UX Guide:**

  * Confirm new password twice in frontend.
  * Show success notification.

---

### 🔁 `updatePasswordByPhone(phone, hashedPassword, callback)`

* **Purpose:** Reset password using verified phone number.
* **Use Case:** `/reset-password` route after OTP verification.
* **UX Guide:**

  * Used when the user forgot the password and verifies phone.
  * Redirect to login screen after reset.

---

### ✏️ `updateName(userId, name, callback)`

* **Purpose:** Update just the user name.
* **Used In:** `/update-name` route.
* **UX Guide:**

  * Useful for inline name edit.
  * Show toast: `"Name updated successfully"`.

---

## 🎨 UI/UX Guide – Summary Table

| Feature            | Backend Function                | UI/UX Behavior                                             |
| ------------------ | ------------------------------- | ---------------------------------------------------------- |
| Register + OTP     | `createUser`, `createOTP`       | Prompt for OTP after form; proceed only on verified status |
| Phone/Email Update | `updateUser`, `markAsVerified`  | Require OTP verification before applying update            |
| Login              | `getByEmail`, `getPasswordById` | Compare password server-side, session on success           |
| Password Reset     | `updatePasswordByPhone`         | Require OTP + new password input + confirm UI flow         |
| Profile Fetch      | `getUserById`                   | Load on dashboard/profile page                             |
| Account Deletion   | `deleteUserById`                | Confirm twice, show goodbye message, clear session         |

---

## 🧪 Development & Testing Tips

* Use Postman or bash script with test users to simulate flows (`register → send-otp → verify → createUser`).
* Log errors from callbacks on both client and server for better traceability.
* Use `.env` for production DB credentials and session secrets.

---
