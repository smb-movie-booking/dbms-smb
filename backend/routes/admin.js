const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

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

router.post('/cinema-seats',adminController.addSeats);

module.exports = router;