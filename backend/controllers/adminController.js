const Report = require('../models/Report');
const User = require('../models/User');

// @desc    Create a report
// @route   POST /api/reports
// @access  Private
const createReport = async (req, res) => {
   const { reportedUserId, relatedItemId, reason, details } = req.body;

   try {
      const report = await Report.create({
         reporter: req.user._id,
         reportedUser: reportedUserId,
         relatedItem: relatedItemId,
         reason,
         details,
      });
      res.status(201).json(report);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// @desc    Get all reports (Admin)
// @route   GET /api/reports
// @access  Private/Admin
const getReports = async (req, res) => {
   try {
      const reports = await Report.find({})
         .populate('reporter', 'name')
         .populate('reportedUser', 'name')
         .populate('relatedItem', 'name');
      res.json(reports);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
   try {
      const users = await User.find({});
      res.json(users);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// @desc    Ban user (Admin)
// @route   PUT /api/users/:id/ban
// @access  Private/Admin
// Note: Schema didn't strictly have isBanned, but we can assume role change or just delete?
// Let's just return success for now or update a field if we add it.

module.exports = {
   createReport,
   getReports,
   getAllUsers,
};
