const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
   request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Request',
      required: true,
   },
   sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   message: {
      type: String,
      required: true,
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

module.exports = mongoose.model('Chat', chatSchema);
