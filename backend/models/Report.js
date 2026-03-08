const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
   reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   reportedUser: { // Optional if reporting an item, but usually targets a user
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   },
   relatedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
   },
   reason: {
      type: String,
      enum: ['Item not returned', 'Item damaged', 'Fake listing', 'Misbehavior', 'Other'],
      required: true,
   },
   details: {
      type: String,
   },
   status: { // Admin handling status
      type: String,
      enum: ['PENDING', 'RESOLVED', 'DISMISSED'],
      default: 'PENDING',
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

module.exports = mongoose.model('Report', reportSchema);
