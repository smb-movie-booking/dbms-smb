# 📄 **Backend API Requirements for Admin Panel**

## **Base URL**

All admin APIs will be under:

```
/api/admin/
```

Example: `GET /api/admin/cities`

---

## **Authentication & Authorization**

* All admin routes must be **protected** — only users with `IsAdmin = 1` in the `User` table can access.
* Middleware should:

  * Verify user session/token.
  * Check `IsAdmin` flag.
  * Return `403 Forbidden` if not admin.

---

## **Entities & Endpoints**

---

### **1. Cities**

**Table:** `City`

| Method | Endpoint          | Description                        | Request Body Example                                                          |
| ------ | ----------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| GET    | `/cities`         | Get list of all cities             | —                                                                             |
| POST   | `/cities`         | Create a new city                  | `{ "City_Name": "Mumbai", "City_State": "Maharashtra", "ZipCode": "400001" }` |
| DELETE | `/cities/:cityId` | Delete city (if no linked cinemas) | —                                                                             |

**Notes:**

* Must handle FK: cannot delete city if any `Cinema.CityID` references it.

---

### **2. Cinemas**

**Table:** `Cinema`

| Method | Endpoint             | Description                        | Request Body Example                                                                                                         |
| ------ | -------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/cinemas`           | List all cinemas                   | —                                                                                                                            |
| POST   | `/cinemas`           | Create a cinema                    | `{ "Cinema_Name": "INOX", "TotalCinemaHalls": 4, "CityID": 1, "Facilities": "Parking,Dolby", "Cancellation_Allowed": true }` |
| DELETE | `/cinemas/:cinemaId` | Delete cinema (if no linked halls) | —                                                                                                                            |

**Notes:**

* Must validate `CityID` exists before insert.

---

### **3. Cinema Halls**

**Table:** `Cinema_Hall`

| Method | Endpoint                | Description                               | Request Body Example                                          |
| ------ | ----------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| GET    | `/cinema-halls`         | List all halls                            | —                                                             |
| POST   | `/cinema-halls`         | Create a hall                             | `{ "Hall_Name": "Hall 1", "TotalSeats": 100, "CinemaID": 1 }` |
| DELETE | `/cinema-halls/:hallId` | Delete hall (if no linked seats or shows) | —                                                             |

**Notes:**

* Must validate `CinemaID` exists before insert.

---

### **4. Cinema Seats**

**Table:** `Cinema_Seat`

| Method | Endpoint        | Description                   | Request Body Example                                 |
| ------ | --------------- | ----------------------------- | ---------------------------------------------------- |
| POST   | `/cinema-seats` | Batch create seats for a hall | `{ "CinemaHallID": 1, "Seats": 50, "Seat_Type": 1 }` |

**Logic:**

* Inserts seat rows for the specified hall.
* Seat numbers can be sequential or custom logic.

---

### **5. Movies**

**Table:** `Movie`

| Method | Endpoint           | Description                       | Request Body Example                                                                                                                                                                   |
| ------ | ------------------ | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/movies`          | List all movies                   | —                                                                                                                                                                                      |
| POST   | `/movies`          | Create a movie                    | `{ "Title": "Inception", "Movie_Description": "...", "Duration": "02:30:00", "Movie_Language": "English", "ReleaseDate": "2025-08-12", "Genre": "Sci-Fi", "Poster_Image_URL": "url" }` |
| DELETE | `/movies/:movieId` | Delete movie (if no linked shows) | —                                                                                                                                                                                      |

**Notes:**

* Must validate date format and required fields.

---

### **6. Shows**

**Table:** `Movie_Show`

| Method | Endpoint                        | Description                                  | Request Body Example                                                                                                                                                               |
| ------ | ------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | `/shows`                        | List all shows (join movie + hall info)      | —                                                                                                                                                                                  |
| POST   | `/shows`                        | Create a show                                | `{ "MovieID": 1, "CinemaHallID": 2, "Show_Date": "2025-08-15", "StartTime": "2025-08-15 18:00:00", "EndTime": "2025-08-15 21:00:00", "Format": "2D", "Show_Language": "English" }` |
| POST   | `/shows/:showId/populate-seats` | Populate `Show_Seat` table using stored proc | `{ "CinemaHallID": 2, "defaultPrice": 150.00 }`                                                                                                                                    |
| DELETE | `/shows/:showId`                | Delete a show (if no confirmed bookings)     | —                                                                                                                                                                                  |

**Logic for `/populate-seats`:**

* Calls:

  ```sql
  CALL PopulateShowSeats(:showId, :CinemaHallID, :defaultPrice);
  ```

---

### **7. Viewing Bookings (Optional)**

**Tables:** `Booking`, `Payment`

| Method | Endpoint    | Description                                 |
| ------ | ----------- | ------------------------------------------- |
| GET    | `/bookings` | List all bookings with show/movie/user info |
| GET    | `/payments` | List all payments with booking info         |

---

## **Response Format (Recommended)**

Use JSON for all responses:

```json
{
  "success": true,
  "data": [ ... ],
  "message": "Optional info"
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

---

## **Foreign Key Constraint Handling**

* Before deleting a record, check if it’s referenced by another table.
* If FK violation would occur, return HTTP `400` with message:
  `"Cannot delete: record is referenced in another table."`
* Use SQL `ON DELETE RESTRICT` logic as in your schema.

---

## **Security**

* **Role check** for every `/admin/*` endpoint.
* Sanitize all input to prevent SQL injection.
* Return **404** for non-existent IDs.
* Use transactions where multiple inserts/updates must succeed together.

---

## **Expected Development Order**

1. Implement **City** endpoints.
2. Implement **Cinema** endpoints.
3. Implement **Cinema Hall** endpoints.
4. Implement **Cinema Seat** batch creation.
5. Implement **Movie** endpoints.
6. Implement **Show** endpoints + stored procedure call.
7. Implement view-only endpoints for bookings/payments.

---
