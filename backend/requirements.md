# Ameen: API Requirement for Movie Listing and Filtering


## **Objective**

We need to build a **single API endpoint** that returns different JSON responses based on the filters given. All supported filters include: `city`, `language`, `genre`, `format`, `theater name/code`, `show date`, `preferred show time`, `price range`, and `movie name/code`. This API will support **movie listings**, **showtimes by theater**, and **detailed movie info**.

## **Steps:**

### ✅ Route

* Add **one route** in `routes/movies.js`:

  ```js
  router.get('/explore', movieController.handleExplore);
  ```

### ✅ Controller (`movieController.js`)

* Create `handleExplore()` to:

  * Read filters from `req.query`.
  * Case logic:

    * `movie` → call `movieModel.getMovieDetails()` for detailed movie info.
    * `theater` + `showDate` →

      1. Call `movieModel.getMoviesByTheaterAndDate()` to get movie info for that theater and date.
      2. Call `showModel.getShowsByTheaterAndDate()` to get list of `showId` and `showTime` (and price if needed).
      3. Merge both results into one JSON before sending to frontend.
    * `city` → call `movieModel.getMoviesByCity()` with optional filters for language, genre, format.

### ✅ Model

* **`movieModel.js`** – SQL queries for movie-level data (titles, genres, formats, ratings, posters, languages).
* **`showModel.js`** – SQL queries for show-level data (showId, showTime, price) joined with `movie_show`, `show_seat`, and `cinema_hall`.
* Both models should dynamically apply filters only when parameters are provided.

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

* **Must:** `city id`
* **Optional:** `language` (up to 5 supported), `genre`, `format` (2D/3D/IMAX)

#### 📤 Response JSON:

For each movie:

* Movie name
* Movie ID
* Poster image
* Rating
* Review count
* Age format (e.g., UA16)
* All languages available across theaters

✅ This should show *all movies currently playing in any theater in the given city*, filtered by the optional params if provided.

---

### 🔹 2. **Browse by Cinemas – Shows in a Specific Theater**

#### ✅ Filters:

* **Must:** `theater ID`, `show date`
* **Optional:** `preferred show time range`, `price range`

#### 📤 Response JSON:

For each movie showing in the theater:

* Movie name
* Movie ID
* All show times in that theater
* All show id
* Format (2D/3D/IMAX)
* Language
* Age format

---

### 🔹 3. **Movie Detail Page – Single Movie Information**

#### ✅ Filters:

* **Must:** `movie id`

#### 📤 Response JSON:

* Poster image
* Movie Name
* Trailer link
* Rating
* Review count
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

### ✅ Controller (`theaterController.js`)

* Create `handleTheaterLookup()` to:

  * Read filters from `req.query`.
  * Case logic:

    * `theater` → call `theaterModel.getTheaterDetails()` for static info (name, address, facilities).
    * `movie` + `showDate` →

      1. Call `theaterModel.getTheatersByMovieAndDate()` for theater list.
      2. Call `showModel.getShowsByMovieAndTheater()` to fetch all showIds and showTimes for each theater.
      3. Merge results into one JSON with facilities and cancellation info.
    * `city` → call `theaterModel.getTheatersByCity()`.

### ✅ Model

* **`theaterModel.js`** – SQL queries for theater-level data (name, address, facilities, cancellation flag).
* **`showModel.js`** – SQL queries for show-level data (showId, showTime, price) joined with `movie_show`, `show_seat`, and `cinema_hall`.
* Use dynamic filters in queries for language, format, preferred time, and price.

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

* **Must:** `city id`

#### 📤 Response JSON:

For each theater:

* Theater name
* Theater id
* Address

✅ This should show *all theaters located in the given city*.

---

### 🔹 2. **Browse Theaters Showing a Movie – Shows by Theater**

#### ✅ Filters:

* **Must:** `movie id`, `show date`
* **Optional:** `preferred show time`, `price range`, `language`, `format`

#### 📤 Response JSON:

For each theater showing the movie:

* Theater name
* Theater id
* List of show times
* All show's id
* Facilities (e.g., parking, food court, recliner seats)
* Cancellation available (boolean)

✅ This shows *only theaters playing the movie on the given date*, filtered by optional parameters.

---

### 🔹 3. **Theater Detail Page – Single Theater Information**

#### ✅ Filters:

* **Must:** `theater id`

#### 📤 Response JSON:

* Theater name
* Full address
* Facilities (as a list: parking, wheelchair access, Dolby sound, etc.)

✅ This shows static detail info about one specific theater.

---