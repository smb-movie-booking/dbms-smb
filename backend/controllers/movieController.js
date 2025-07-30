const movieModel = require('../models/movieModel');

exports.getAllMovies = (req, res) => {
  movieModel.getAll((err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error fetching movies');
    }
    res.json(data);
  });
};
