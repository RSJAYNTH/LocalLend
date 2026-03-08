const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
   borrower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
   },
   owner: { // Denormalized for easier query by owner
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   startDate: {
      type: Date,
      required: true,
   },
   endDate: {
      type: Date,
      required: true,
   },
   status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'RETURNED', 'CANCELLED'],
      default: 'PENDING',
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

requestSchema.index({ item: 1, startDate: 1, endDate: 1 });
requestSchema.index({ owner: 1, status: 1 });
requestSchema.index({ borrower: 1, status: 1 });

module.exports = mongoose.model('Request', requestSchema);
