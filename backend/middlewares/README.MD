# Middlewares (`/middlewares`)

This directory contains middleware functions for the Express application. Middlewares are functions that run *between* an incoming request and the final route handler (controller). They are used for tasks like authentication, authorization, and processing request data.

## Files

### `isAuthenticated.js`

This is an **authentication** middleware.

* **Purpose**: To protect routes that require a user to be logged in.
* **How it works**: It checks if a user object exists in the session (`req.session.user`).
    * If **yes**, it calls `next()` to allow the request to proceed to the next handler (e.g., the controller).
    * If **no**, it stops the request and returns a `401 Unauthorized` error, prompting the user to log in.

### `isAdmin.js`

This is an **authorization** middleware.

* **Purpose**: To protect routes that are *only* accessible to administrators. This middleware should be used *after* `isAuthenticated.js`.
* **How it works**: It checks if the logged-in user (`req.session.user`) has the `isAdmin` property set to `true`.
    * If **yes**, it calls `next()` to allow the request to proceed.
    * If **no** (or if the user isn't logged in), it stops the request and returns a `403 Forbidden` error.

### `multer.js`

This file handles file uploads, specifically for images, by integrating `multer` with Cloudinary.

* `upload`: This is the core `multer` middleware configured to use **memory storage**. When applied to a route, it parses `multipart/form-data` (like an image upload) and stores the file as a buffer in `req.file`. No files are saved to the server's disk.
* `uploadToCloudinary`: This is a subsequent middleware designed to run *after* `upload`.
    * It takes the file buffer from `req.file.buffer`.
    * It streams the buffer directly to the Cloudinary upload service.
    * Once Cloudinary confirms the upload, it receives a `secure_url` (the public URL of the image) and attaches it to `req.body.imageUrl`.
    * It then calls `next()` so the controller function (e.g., `addMovie`) can access `req.body.imageUrl` and save it to the database.