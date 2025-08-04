const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Flush route: /admin/flush
router.post('/flush', adminController.flushAllTables);

module.exports = router;