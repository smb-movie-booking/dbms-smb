const showModel = require('../models/showModel');

exports.getShowsByMovieTheaterDate = async (req, res) => {
    const { movieID, theaterID, showDate } = req.body;

    if (!movieID || !theaterID || !showDate) {
        return res.status(400).json({ error: 'movieID, theaterID and showDate are required' });
    }

    try {
        const shows = await showModel.fetchShows(movieID, theaterID, showDate);
        return res.status(200).json(shows);
    } catch (error) {
        console.error('Error fetching shows:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


