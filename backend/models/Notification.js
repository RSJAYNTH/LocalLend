const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
   recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   type: {
      type: String,
      enum: ['REQUEST_RECEIVED', 'REQUEST_APPROVED', 'REQUEST_REJECTED', 'ITEM_RETURNED'],
      required: true,
   },
   message: {
      type: String,
      required: true,
   },
   read: {
      type: Boolean,
      default: false,
   },
   relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      // Can ref Request or Item, leaving dynamic
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

module.exports = mongoose.model('Notification', notificationSchema);
