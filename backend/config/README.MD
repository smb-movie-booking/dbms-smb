# Configuration (`/config`)

This directory holds all environment and service configurations for the backend application.

## Purpose

The files in this folder are responsible for setting up and configuring external services, primarily the database connection and session management.

## Files

### `db.js`

This is the main database initialization file. It performs several key functions:

* [cite_start]**Database Connection**: Uses the `mysql2` library to create a connection pool to the MySQL database[cite: 2]. A pool is more efficient than a single connection for handling multiple concurrent users.
* [cite_start]**Session Storage**: Configures `express-mysql-session` to use the MySQL database as a session store[cite: 2]. This means user login sessions are saved in the database, allowing sessions to persist even if the server restarts.
* [cite_start]**Environment Variables**: Loads all sensitive credentials (host, user, password, database name) from a `.env` file at the root of the backend[cite: 2].
* [cite_start]**Secure Connection**: Implements SSL for the database connection by loading the `ca.pem` certificate[cite: 2]. This ensures that all data transferred between the application and the database is encrypted.
* **Exports**: It exports the `db` connection pool and the `sessionStore` to be used by `app.js` and other parts of the application.

### `ca.pem`

[cite_start]This is an SSL certificate file, specifically the Certificate Authority (CA) certificate[cite: 1]. [cite_start]It is used by `db.js` to verify the identity of the database server and establish a secure, encrypted (SSL) connection[cite: 2]. This is critical for protecting sensitive data like user passwords and booking information.