const movieModel = require('../models/movieModel');
const showModel = require('../models/showModel');

const handleExplore = async(req,res) => {
    try{
        const {city, language, genre, format, theater, showDate, movie } = req.query;
        if(movie) {
            const details = await movieModel.getMovieDetail(movie);
            return res.json(details);
        }
        if (theater && showDate) {
        const movies = await movieModel.getMoviesByTheaterAndDate(theater, showDate);
        const shows = await showModel.fetchShowsByTheaterAndDate(theater, showDate);
        const merged = movies.map(m => ({
            ...m,
            shows: shows.filter(s => s.movieId === m.movieId)
        }));

        return res.json(merged);
        }
        if (city) {
        const movies = await movieModel.getMoviesByCity(city, { language, genre, format });
        return res.json(movies);
        }
        return res.status(400).json({ error: "Invalid query params" });

    }catch(err){
        console.error(err);
        res.status(500).json({error: "server error"});
    }
}

module.exports = { handleExplore };


