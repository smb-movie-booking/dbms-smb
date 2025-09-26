const movieModel = require('../models/movieModel');
const showModel = require('../models/showModel');

const handleExplore = async(req,res) => {
    try{
        const {city, language, genre, format, theater, showDate, movie } = req.query;
        if (movie) {
            movieModel.getMovieDetails(movie, (err, details) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to fetch movie details" });
                }
                return res.json(details);
            });
        }
        else if (theater && showDate) {
            movieModel.getMoviesByTheaterAndDate(theater, showDate, (err, movies) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to fetch movies" });
                }

                showModel.fetchShowsByTheaterAndDate(theater, showDate, (err2, shows) => {
                    if (err2) {
                        return res.status(500).json({ error: "Failed to fetch shows" });
                    }

                    const merged = movies.map(m => ({
                        ...m,
                        shows: shows.filter(s => s.movieId === m.MovieID)
                    }));

                    return res.json(merged);
                });
            });
        }

        else if (city) {
        movieModel.getMoviesByCity(city, { language, genre, format }, (err, movies) => {
            if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });
            }
            return res.json(movies);
        });
        } else {
        return res.status(400).json({ error: "Invalid query params" });
        }

    }catch(err){
        console.error(err);
        res.status(500).json({error: "server error"});
    }
}

module.exports = { handleExplore };