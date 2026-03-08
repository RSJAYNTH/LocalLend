const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   firebaseUid: {
      type: String,
      required: true,
      unique: true,
   },
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   phone: {
      type: String,
      // required: true, // Optional if we allow email only sign up initially, but Prompt says Verified Phone Number is stored.
   },
   pincode: {
      type: String,
      required: true,
   },
   address: {
      type: String,
      // default: '',
   },
   reputation: {
      type: Number,
      default: 0,
   },
   role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
   },
   createdAt: {
      type: Date,
      default: Date.now,
   },
});

module.exports = mongoose.model('User', userSchema);
