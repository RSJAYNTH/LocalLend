const Chat = require('../models/Chat');
const Request = require('../models/Request');
const { createNotification } = require('./notificationController');

// @desc    Send a message
// @route   POST /api/chat
// @access  Private
const sendMessage = async (req, res) => {
   const { requestId, message } = req.body;

   try {
      const request = await Request.findById(requestId).populate('item');
      if (!request) {
         return res.status(404).json({ message: 'Request not found' });
      }

      // Verify user is part of the request
      if (
         request.borrower.toString() !== req.user._id.toString() &&
         request.owner.toString() !== req.user._id.toString()
      ) {
         return res.status(401).json({ message: 'Not authorized' });
      }

      const chat = await Chat.create({
         request: requestId,
         sender: req.user._id,
         message,
      });

      // Notify the other party
      const recipientId = request.borrower.toString() === req.user._id.toString()
         ? request.owner
         : request.borrower;

      // Optional: Notify for chat? Prompt says notifications for "New borrow requests", "Acceptance", "Return".
      // Doesn't explicitly say for Chat messages. Use explicit instructions: "Notifications must be created for: New borrow requests, Request acceptance, Item return."
      // So NO chat notifications required. I'll skip it to keep it simple as requested ("system must be realistic... focusing on correct system design rather than unnecessary complexity").

      res.status(201).json(chat);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// @desc    Get messages for a request
// @route   GET /api/chat/:requestId
// @access  Private
const getMessages = async (req, res) => {
   try {
      const request = await Request.findById(req.params.requestId);
      if (!request) {
         return res.status(404).json({ message: 'Request not found' });
      }

      if (
         request.borrower.toString() !== req.user._id.toString() &&
         request.owner.toString() !== req.user._id.toString()
      ) {
         return res.status(401).json({ message: 'Not authorized' });
      }

      const messages = await Chat.find({ request: req.params.requestId })
         .populate('sender', 'name')
         .sort({ createdAt: 1 });

      res.json(messages);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

module.exports = {
   sendMessage,
   getMessages,
};
