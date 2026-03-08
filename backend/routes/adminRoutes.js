const express = require('express');
const router = express.Router();
const {
   createReport,
   getReports,
   getAllUsers,
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// User reports
router.post('/reports', protect, createReport);

// Admin Routes
router.get('/reports', protect, admin, getReports);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
