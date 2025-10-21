const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const {upload, uploadToCloudinary } = require('../middlewares/multer');

// Flush route: /admin/flush
router.post('/flush', adminController.flushAllTables);
//router.post('/register', adminController.registerAdmin);
router.post('/cities',adminController.createNewCity)
router.get('/cities',adminController.getAllCities)
router.delete('/cities/:id',adminController.deleteCity);

router.post('/cinemas',adminController.addNewCinemas);
router.get('/cinemas',adminController.getAllCinemas)
router.delete('/cinemas/:id',adminController.deleteCinemas);


router.post('/cinema-halls',adminController.addNewCinemaHall);
router.get('/cinema-halls',adminController.getAllCinemaHalls);
router.delete('/cinema-halls/:id', adminController.deleteCinemaHall);
router.get('/detail/halls',adminController.getHallPlusCinemaName);

router.get('/cinema-seats', adminController.getCinemaSeats);

router.post('/movie',upload.single("file"),uploadToCloudinary,adminController.addMovie)
router.get('/movie',adminController.getMovies)
router.delete('/movie/:id',adminController.deleteMovie)


router.post('/shows', adminController.addNewShow);
router.get('/view-shows', adminController.getAllShows); // The name is fine, it's what the frontend calls
router.delete('/shows/:id', adminController.deleteShow); 
router.put('/shows/:id', adminController.editShow);
router.put('/shows/:id/status',  adminController.updateShowStatus);

router.put('/movie/:id', adminController.editMovie);
router.put('/city/:id', adminController.editCity);
router.put('/cinema/:id', adminController.editCinema);
router.put('/cinema-hall/:id', adminController.editHall);

router.put('/shows/:id', adminController.editShow);
router.put('/shows/:id/status',  adminController.updateShowStatus);

module.exports = router;