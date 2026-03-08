const express = require('express');
const router = express.Router();
const {
   verifyUser,
   registerUser,
   getUserProfile,
   updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/verify', protect, verifyUser);
router.post('/register', protect, registerUser);
router.route('/profile')
   .get(protect, getUserProfile)
   .put(protect, updateUserProfile);

module.exports = router;
