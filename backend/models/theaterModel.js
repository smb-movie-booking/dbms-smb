const { db } = require('../config/db');

/**
 * Fetches a list of unique theaters showing a specific movie on a specific date.
 */
const getTheatersByMovieAndDate = (movieId, date, cityId, callback) => {
  const sql = `
    SELECT DISTINCT
      c.CinemaID,
      c.Cinema_Name AS cinemaName,
      c.Facilities,
      c.Cancellation_Allowed AS cancellationAllowed
    FROM Cinema c
    JOIN Cinema_Hall ch ON c.CinemaID = ch.CinemaID
    JOIN Movie_Show ms ON ch.CinemaHallID = ms.CinemaHallID
    WHERE ms.MovieID = ?
      AND DATE(ms.Show_Date) = ?
      AND c.CityID = ? 
      AND ms.isActive = TRUE
    ORDER BY c.Cinema_Name;
  `;

  // The parameters must be in the same order as the '?' placeholders in the query
  db.query(sql, [movieId, date, cityId], (err, results) => {
    if (err) {
      console.error("Error fetching theaters by movie, date, and city:", err);
      return callback(err, null);
    }
    callback(null, results);
  });
};

// ===============================
// ✅ Newly Added Implementations
// ===============================

/**
 * Fetch detailed information for a specific theater.
 * Includes full address, facilities (split into array), and cancellation policy.
 */
const getTheaterDetails = (theaterId, callback) => {
  const sql = `
    SELECT 
      CinemaID,
      Cinema_Name AS cinemaName,
      Facilities,
      Cancellation_Allowed AS cancellationAllowed,
      Address_Line1,
      Address_Line2,
      City_Name,
      PinCode
    FROM Cinema
    WHERE CinemaID = ?
    LIMIT 1;
  `;

  db.query(sql, [theaterId], (err, results) => {
    if (err) {
      console.error("Error fetching theater details:", err);
      return callback(err, null);
    }

    if (results.length === 0) {
      return callback(null, null);
    }

    const t = results[0];
    const facilities = t.Facilities
      ? t.Facilities.split(',').map(f => f.trim()).filter(Boolean)
      : [];

    const fullAddressParts = [
      t.Address_Line1,
      t.Address_Line2,
      t.City_Name,
      t.PinCode
    ].filter(Boolean);

    const theaterDetails = {
      cinemaId: t.CinemaID,
      cinemaName: t.cinemaName,
      facilities,
      cancellationAllowed: !!t.cancellationAllowed,
      fullAddress: fullAddressParts.join(', ')
    };

    callback(null, theaterDetails);
  });
};

/**
 * Fetch all theaters in a given city.
 */
const getTheatersByCity = (cityId, callback) => {
  const sql = `
    SELECT
      CinemaID,
      Cinema_Name AS cinemaName,
      Facilities,
      Cancellation_Allowed AS cancellationAllowed,
      Created_At,
      Updated_At
    FROM Cinema
    WHERE CityID = ?
    ORDER BY Cinema_Name;
  `;

  db.query(sql, [cityId], (err, results) => {
    if (err) {
      console.error("Error fetching theaters by city:", err);
      return callback(err, null);
    }

    // Normalize output
    const formatted = results.map(r => ({
      cinemaId: r.CinemaID,
      cinemaName: r.cinemaName,
      address: (r.address && r.address.trim()) ? r.address.trim() : null
    }));

    callback(null, formatted);
  });
};

// ===============================

module.exports = {
  getTheatersByMovieAndDate,
  getTheaterDetails,
  getTheatersByCity
};
