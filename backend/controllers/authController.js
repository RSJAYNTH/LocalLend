const User = require('../models/User');

// @desc    Check if user exists or register helper
// @route   POST /api/auth/verify
// @access  Private (Firebase Token)
const verifyUser = async (req, res) => {
   try {
      const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });
      if (user) {
         res.json({ exists: true, user });
      } else {
         res.json({ exists: false, user: null });
      }
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Private
const registerUser = async (req, res) => {
   const { name, email, pincode, phone, address } = req.body;

   try {
      // 1. Check if user exists by Firebase UID (Standard check)
      let user = await User.findOne({ firebaseUid: req.firebaseUser.uid });

      if (user) {
         return res.status(400).json({ message: 'User already exists' });
      }

      // 2. Check if user exists by Email (Legacy/Re-link check)
      const existingUserByEmail = await User.findOne({ email: req.firebaseUser.email || email });

      if (existingUserByEmail) {
         // RE-LINK ACCOUNT: Update the old user record with new Firebase UID
         existingUserByEmail.firebaseUid = req.firebaseUser.uid;

         if (name) existingUserByEmail.name = name.trim();
         if (phone) existingUserByEmail.phone = phone.trim();
         if (pincode) existingUserByEmail.pincode = pincode.trim();
         if (address) existingUserByEmail.address = address;

         await existingUserByEmail.save();
         return res.status(200).json(existingUserByEmail);
      }

      // 3. Create New User
      user = await User.create({
         firebaseUid: req.firebaseUser.uid,
         name: name ? name.trim() : undefined,
         email: req.firebaseUser.email || email,
         phone: phone ? phone.trim() : undefined,
         pincode: pincode ? pincode.trim() : undefined,
         address,
      });

      res.status(201).json(user);
   } catch (error) {
      if (error.code === 11000) {
         return res.status(400).json({ message: 'Email already exists. Please login instead.' });
      }
      res.status(500).json({ message: error.message });
   }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
   if (req.user) {
      res.json(req.user);
   } else {
      res.status(404).json({ message: 'User not found in DB' });
   }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
   const user = await User.findById(req.user._id);

   if (user) {
      user.name = req.body.name ? req.body.name.trim() : user.name;
      user.pincode = req.body.pincode ? req.body.pincode.trim() : user.pincode;
      user.address = req.body.address || user.address;
      user.phone = req.body.phone ? req.body.phone.trim() : user.phone;

      const updatedUser = await user.save();
      res.json(updatedUser);
   } else {
      res.status(404).json({ message: 'User not found' });
   }
};

module.exports = {
   verifyUser,
   registerUser,
   getUserProfile,
   updateUserProfile,
};
