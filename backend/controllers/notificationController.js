const Notification = require('../models/Notification');

// Helper to create notification (Internal use)
const createNotification = async (recipientId, type, message, relatedId) => {
   try {
      await Notification.create({
         recipient: recipientId,
         type,
         message,
         relatedId,
      });
   } catch (error) {
      console.error('Notification Error:', error.message);
   }
};

// @desc    Get my notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
   try {
      const notifications = await Notification.find({ recipient: req.user._id })
         .sort({ createdAt: -1 });
      res.json(notifications);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationRead = async (req, res) => {
   try {
      const notification = await Notification.findById(req.params.id);
      if (notification && notification.recipient.toString() === req.user._id.toString()) {
         notification.read = true;
         await notification.save();
         res.json(notification);
      } else {
         res.status(404).json({ message: 'Notification not found' });
      }
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

module.exports = {
   createNotification,
   getNotifications,
   markNotificationRead,
};
