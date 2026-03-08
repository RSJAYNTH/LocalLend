const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
   owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   name: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: true,
   },
   category: {
      type: String,
      required: true,
      enum: ['Electronics', 'Tools', 'Books', 'Sports', 'Clothing', 'Other'],
   },
   images: [{
      type: String, // URLs
   }],
   pincode: {
      type: String,
      required: true, // Denormalized for filtering
   },
   status: {
      type: String,
      enum: ['AVAILABLE', 'IN_USE', 'INACTIVE'], // Simplified: Booked/Requested managed via Requests
      default: 'AVAILABLE',
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
   // Future enhancement: availability ranges
});

// Index for search
itemSchema.index({ pincode: 1, status: 1 });
itemSchema.index({ name: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Item', itemSchema);
