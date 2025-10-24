# Utilities (`/utils`)

This directory contains helper functions, service initializations, and background jobs that support the main application logic.

## Files

### `cloudinary.js`

This file configures and exports the official Cloudinary SDK.

* **Purpose**: It reads the `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` from the `.env` file and initializes the Cloudinary object.
* **Usage**: This configured object is imported by the `middlewares/multer.js` file to handle streaming image uploads (like movie posters) directly to the Cloudinary service.

### `parse.js`

This file provides a utility for parsing complex seat configurations.

* **Purpose**: It exports a `parseSeatRanges` function, which is used by the Admin controller when creating a new Cinema Hall.
* **Functionality**: It takes a configuration array (e.g., `[{ type: "Gold", ranges: "1-10, 15" }]`) and safely expands it into a flat array of individual seat objects (e.g., `[{ number: 1, type: "Gold" }, ...]`). It also validates the input to prevent duplicate seat numbers or invalid ranges.

### `cleanupService.js`

This file contains a background cron job for maintaining booking integrity.

* **Purpose**: It exports a `startCleanupJob` function that uses `node-cron` to run a task every minute.
* **Functionality**: The scheduled task (`cancelExpiredBookings`) automatically finds "Pending" bookings (Status=1) that are older than one minute. It then releases the seats associated with these abandoned bookings (setting them back to "Available") and updates the booking status to "Expired" (Status=4tobe). This prevents seats from being held indefinitely if a user closes the payment window.