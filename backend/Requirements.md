# API Requirement for Movie Listing and Filtering


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

### ✅ Tables Involved

* Use: `movie`, `movie_show`, `show_seat`, `cinema_hall`, `cinema`, `city`
* Optional (for reviews): `user`, `booking`, or a `review` table if it exists

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