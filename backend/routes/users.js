const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const isAuthenticated = require('../middlewares/isAuthenticated'); // import your middleware

router.get('/me', isAuthenticated, userController.getProfile);
router.put('/me', isAuthenticated, userController.updateProfile);

module.exports = router;
