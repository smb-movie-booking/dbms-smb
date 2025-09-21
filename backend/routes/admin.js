const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {upload, uploadToCloudinary } = require('../middlewares/multer');

// Flush route: /admin/flush
router.post('/flush', adminController.flushAllTables);
//router.post('/register', adminController.registerAdmin);
router.post('/addcity',adminController.createNewCity)
router.get('/cities',adminController.getAllCities)
router.delete('/cities/:id',adminController.deleteCity);

router.post('/cinemas',adminController.addNewCinemas);
router.get('/cinemas',adminController.getAllCinemas)
router.delete('/cinemas/:id',adminController.deleteCinemas);


router.post('/cinema-halls',adminController.addNewCinemaHall);
router.get('/cinema-halls',adminController.getAllCinemaHalls);
router.get('/detail/halls',adminController.getHallPlusCinemaName);

router.post('/cinema-seats',adminController.addSeats);

router.post('/movie',upload.single("image"),uploadToCloudinary,adminController.addMovie)
router.get('/movie',adminController.getMovies)
router.delete('/movie/:id',adminController.deleteMovie)


router.post('/shows',adminController.addNewShow)
router.get('/shows',adminController.getAllShows)
router.delete('/shows/:id',adminController.deleteShow)

module.exports = router;