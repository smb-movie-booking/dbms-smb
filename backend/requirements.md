# Ameen: API Requirement for Movie Listing and Filtering


## **Objective**

We need to build a **single API endpoint** that returns different JSON responses based on the filters given. All supported filters include: `city`, `language`, `genre`, `format`, `theater name/code`, `show date`, `preferred show time`, `price range`, and `movie name/code`. This API will support **movie listings**, **showtimes by theater**, and **detailed movie info**.

## **Steps:**

### ✅ Route

* Add **one route** in `routes/movies.js`:

  ```js
  router.get('/explore', movieController.handleExplore);
  ```

### ✅ Controller

* In `movieController.js`, create `handleExplore()` to:

  * Check filters from `req.query`
  * Call the appropriate logic based on:

    * `movie` → return detailed movie info
    * `theater` + `showDate` → return shows in that theater
    * `city` → return list of movies in city with optional filters

### ✅ Model

* In `movieModel.js`, write SQL queries to:

  * Join tables like `movie`, `movie_show`, `cinema`, `cinema_hall`, `city`, `show_seat`
  * Apply filters dynamically
  * Group languages, showtimes, and formats as needed

---

### ✅ Tables Involved

* Use: `movie`, `movie_show`, `cinema`, `cinema_hall`, `city`, `show_seat`
* Optional (for reviews): `user`, `booking`, or a `review` table if it exists
* **Ensure these columns exist in `movie` table**:

  * `Genre VARCHAR(20)` – to support filtering by genre
  * `Movie_Language VARCHAR(16)` – for language filter
  * `ReleaseDate`, `Duration`, `Movie_Description` – for detail page
  * `Rating` (you can add this as `DECIMAL(2,1)` or similar, if needed for home/listing UI)
  * `Poster_Image_URL VARCHAR(255)` – to show posters
  * `Trailer_URL VARCHAR(255)` – optional, for movie detail page

---

## **Requirements**

### 🔹 1. **Home Page – Movie List API**

#### ✅ Filters:

* **Must:** `city`
* **Optional:** `language` (up to 5 supported), `genre`, `format` (2D/3D/IMAX)

#### 📤 Response JSON:

For each movie:

* Movie name
* Poster image
* Rating
* Age format (e.g., UA16)
* All languages available across theaters

✅ This should show *all movies currently playing in any theater in the given city*, filtered by the optional params if provided.

---

### 🔹 2. **Browse by Cinemas – Shows in a Specific Theater**

#### ✅ Filters:

* **Must:** `theater name or code`, `show date`
* **Optional:** `preferred show time range`, `price range`

#### 📤 Response JSON:

For each movie showing in the theater:

* Movie name
* All show times in that theater
* Format (2D/3D/IMAX)
* Language
* Age format

---

### 🔹 3. **Movie Detail Page – Single Movie Information**

#### ✅ Filters:

* **Must:** `movie name or code`

#### 📤 Response JSON:

* Poster image
* Trailer link
* Rating
* All formats available
* All genres (multiple allowed)
* Release date
* Movie length
* Age format
* Movie description
* Review count
* 5 review comments (with username + rating)

---

# Abijeeth: API Requirement for Theater Listing and Details

## **Objective**

We need to build a **single API endpoint** that returns different JSON responses based on the filters given. All supported filters include: `city`, `movie name/code`, `show date`, `price range`, `preferred show time`, `language`, `format`, and `theater name/code`. This API will support **theater listings**, **theater-wise showtimes**, and **theater detail page**.

---

## **Steps:**

### ✅ Route

* Add **one route** in `routes/theaters.js`:

  ```js
  router.get('/lookup', theaterController.handleTheaterLookup);
  ```

---

### ✅ Controller

* In `theaterController.js`, create `handleTheaterLookup()` to:

  * Check filters from `req.query`
  * Call the appropriate logic based on:

    * `theater` → return detailed theater info
    * `movie` + `showDate` → return list of theaters showing that movie
    * `city` → return all theaters in city

---

### ✅ Model

* In `theaterModel.js`, write SQL queries to:

  * Join `cinema`, `cinema_hall`, `movie_show`, `city`, and optionally `show_seat`
  * Dynamically apply filters like language, format, preferred time, etc.
  * Group shows per theater

---

### ✅ Tables Involved

* Use: `cinema`, `cinema_hall`, `city`, `movie_show`, `movie`, `show_seat`
* **Add these columns to `cinema` table**:

  * `Facilities VARCHAR(255)` – to store comma-separated features like parking, Dolby, recliners
  * `Cancellation_Allowed BOOLEAN DEFAULT FALSE` – to indicate if bookings can be cancelled for that theater

---

## **Requirements**

### 🔹 1. **Browse Theaters by City – Theater List API**

#### ✅ Filters:

* **Must:** `city`

#### 📤 Response JSON:

For each theater:

* Theater name
* Address
* Theater code

✅ This should show *all theaters located in the given city*.

---

### 🔹 2. **Browse Theaters Showing a Movie – Shows by Theater**

#### ✅ Filters:

* **Must:** `movie name or code`, `show date`
* **Optional:** `preferred show time`, `price range`, `language`, `format`

#### 📤 Response JSON:

For each theater showing the movie:

* Theater name
* List of show times
* Facilities (e.g., parking, food court, recliner seats)
* Cancellation available (boolean)

✅ This shows *only theaters playing the movie on the given date*, filtered by optional parameters.

---

### 🔹 3. **Theater Detail Page – Single Theater Information**

#### ✅ Filters:

* **Must:** `theater name or code`

#### 📤 Response JSON:

* Full address
* Facilities (as a list: parking, wheelchair access, Dolby sound, etc.)

✅ This shows static detail info about one specific theater.

---