const seatModel = require('../models/seatModel');

exports.getSeatsByShowId = async (req, res) => {
  const showId = req.params.showId;

  try {
    const seats = await seatModel.fetchSeatsByShowId(showId);
    res.status(200).json({ showId, seats });
  } catch (error) {
    console.error('❌ Error fetching seats:', error);
    res.status(500).json({ error: 'Failed to retrieve seats' });
  }
};
