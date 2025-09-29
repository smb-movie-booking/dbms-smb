const theaterModel = require('../models/theaterModel');
const showModel = require('../models/showModel');

const handleTheaterLookup = async (req, res) => {
  try {
    // Read all possible filters from the request query
    const { movie, showDate, city, theater, format, language, preferredTime } = req.query;

    // This case handles fetching details for a single theater (for the popup modal)
    if (theater) {
      theaterModel.getTheaterDetails(theater, (err, details) => {
        if (err) {
          return res.status(500).json({ error: "Failed to fetch theater details" });
        }
        if (!details) {
          return res.status(404).json({ error: "Theater not found" });
        }
        return res.json(details);
      });
    }

    // This case handles fetching theaters and their shows for a specific movie
    else if (movie && showDate && city) {
      // Group all optional filters into a single object
      const filters = { format, language, preferredTime };

      // First, get all theaters in the city playing the movie on that date
      theaterModel.getTheatersByMovieAndDate(movie, showDate, city, (err, theaters) => {
        if (err) {
          return res.status(500).json({ error: "Failed to fetch theaters" });
        }
        // If no theaters are found initially, we can stop here
        if (!theaters || theaters.length === 0) {
          return res.json([]);
        }

        const theaterIds = theaters.map(t => t.CinemaID);

        // Second, get the shows for those theaters, applying the advanced filters
        showModel.getShowsByMovieAndTheaters(movie, theaterIds, showDate, filters, (err2, shows) => {
          if (err2) {
            return res.status(500).json({ error: "Failed to fetch shows" });
          }

          // Third, merge the theaters with their corresponding shows
          const mergedData = theaters.map(theater => ({
            ...theater,
            shows: shows.filter(show => show.CinemaID === theater.CinemaID)
          }));
          
          // Finally, filter out any theaters that no longer have shows after applying the filters
          const theatersWithShows = mergedData.filter(theater => theater.shows.length > 0);

          return res.json(theatersWithShows);
        });
      });
    }
    
    // Placeholder for your teammate's logic to list all theaters in a city
    else if (city) {
        return res.json({ message: `TODO: Implement fetch for all theaters in city ID: ${city}` });
    }

    else {
      return res.status(400).json({ error: "Invalid query parameters for theater lookup" });
    }

  } catch (err) {
    console.error("Server error in theater lookup:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { handleTheaterLookup };

