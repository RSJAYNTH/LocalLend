const express = require('express');
const router = express.Router();
const {
   getNotifications,
   markNotificationRead,
} = require('../controllers/notificationController');
const {
   sendMessage,
   getMessages
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// Notifications
router.get('/notifications', protect, getNotifications);
router.put('/notifications/:id/read', protect, markNotificationRead);

// Chat
router.post('/chat', protect, sendMessage);
router.get('/chat/:requestId', protect, getMessages);

module.exports = router;
