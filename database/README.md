# Database (`/database`)

This directory contains all resources related to the application's MySQL database. It includes the official schema, visual diagrams, and scripts to populate the database with data for development and testing.

## Schema Overview

The database is designed to model a movie ticket booking system. The core entities are:

* **User Management**: `User`, `OTP`
* **Theater Infrastructure**: `City`, `Cinema` (Theater), `Cinema_Hall`, `Cinema_Seat`
* **Movie & Show Management**: `Movie`, `Movie_Show`, `Review`
* **Booking & Payment**: `Booking`, `Show_Seat` (the link table), `Payment`

### Advanced Features

The schema (`smb.sql`) includes advanced MySQL features for integrity and performance:

* **Triggers**: `trg_after_review_insert`, `trg_after_review_update`, `trg_after_review_delete` automatically recalculate a movie's average rating whenever a review is added, updated, or removed.
* **Stored Procedures**: `PopulateShowSeats` is a procedure that creates a `Show_Seat` entry for every `Cinema_Seat` in a hall when a new `Movie_Show` is created.
* **Scheduled Events**: `ev_update_show_status` runs every minute to automatically mark old shows as inactive/expired.
* **Indexes**: Multiple indexes (`idx_...`) are created on foreign keys and common query fields (like `Movie_Language`, `Show_Date`) to ensure high-speed data retrieval.

---

## File Descriptions

* **`smb.sql`**: The main schema definition file. This script contains all `CREATE TABLE`, `CREATE INDEX`, `CREATE PROCEDURE`, `CREATE TRIGGER`, and `CREATE EVENT` statements. **This is the single source of truth for the database structure.**

* **`ER.pdf` / `ER.svg`**: Visual Entity-Relationship Diagrams that show the database tables and their relationships (e.g., `User` has many `Bookings`, `Movie_Show` has many `Show_Seats`).

* **`populate.sql`**: A **large-scale data seeding script**. It first truncates (clears) all tables and then populates the database with a vast amount of realistic, randomly-generated data (10 cities, 100 cinemas, ~10,000 shows, plus bookings, reviews, etc.). This is ideal for full-scale development and stress-testing the application.

* **`insert.sql`**: A **minimal test script**. It inserts only a handful of specific, predictable records (1 city, 1 cinema, 1 movie, 2 shows). This is useful for running automated tests or for basic API verification in a clean environment.

---

## 🚀 How to Set Up a Local Database

1.  **Create the Database**:
    Ensure you have a running MySQL server. Log in as a root or superuser and create the database.

    ```sql
    CREATE DATABASE smb;
    USE smb;
    ```

2.  **Run the Schema**:
    Execute the `smb.sql` file to create all the tables, triggers, and procedures.

    ```bash
    # From your terminal
    mysql -u your_username -p smb < smb.sql
    ```

3.  **Populate the Database (Choose ONE)**:

    * **A) For Full Development (Recommended):**
        Use `populate.sql` to get a fully-featured database with lots of data to interact with.

        ```bash
        mysql -u your_username -p smb < populate.sql
        ```

    * **B) For Basic Testing:**
        Use `insert.sql` if you only need the bare minimum for tests to run.

        ```bash
        mysql -u your_username -p smb < insert.sql
        ```

Your database is now set up and ready to be connected to the backend application.