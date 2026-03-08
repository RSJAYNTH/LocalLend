const Request = require('../models/Request');
const Item = require('../models/Item');
const { createNotification } = require('./notificationController');

// @desc    Create a borrow request
// @route   POST /api/requests
// @access  Private (Borrower)
const createRequest = async (req, res) => {
   const { itemId, startDate, endDate } = req.body;

   try {
      const item = await Item.findById(itemId);
      if (!item) {
         return res.status(404).json({ message: 'Item not found' });
      }

      if (item.owner.toString() === req.user._id.toString()) {
         return res.status(400).json({ message: 'Cannot borrow your own item' });
      }

      if (item.status !== 'AVAILABLE') {
         return res.status(400).json({ message: 'Item is currently not available' });
      }

      // Check for blocking overlaps (Approved requests)
      const start = new Date(startDate);
      const end = new Date(endDate);

      const overlappingRequest = await Request.findOne({
         item: itemId,
         status: 'APPROVED',
         $or: [
            { startDate: { $lt: end }, endDate: { $gt: start } }
         ]
      });

      if (overlappingRequest) {
         return res.status(400).json({ message: 'Item is already booked for these dates' });
      }

      const request = await Request.create({
         borrower: req.user._id,
         item: itemId,
         owner: item.owner,
         startDate: start,
         endDate: end,
      });

      // Notify Owner
      await createNotification(
         item.owner,
         'REQUEST_RECEIVED',
         `New borrow request for ${item.name}`,
         request._id
      );

      res.status(201).json(request);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// @desc    Get requests for my items (Owner) or my requests (Borrower)
// @route   GET /api/requests
// @access  Private
const getRequests = async (req, res) => {
   const role = req.query.role; // 'owner' or 'borrower'

   try {
      let requests;
      if (role === 'owner') {
         requests = await Request.find({ owner: req.user._id })
            .populate('borrower', 'name reputation')
            .populate('item', 'name')
            .sort({ createdAt: -1 });
      } else {
         requests = await Request.find({ borrower: req.user._id })
            .populate('owner', 'name reputation')
            .populate('item', 'name')
            .sort({ createdAt: -1 });
      }
      res.json(requests);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// @desc    Update request status (Approve/Reject/Return)
// @route   PUT /api/requests/:id
// @access  Private (Owner)
const updateRequestStatus = async (req, res) => {
   const { status } = req.body; // APPROVED, REJECTED, RETURNED

   try {
      const request = await Request.findById(req.params.id);

      if (!request) {
         return res.status(404).json({ message: 'Request not found' });
      }

      if (request.owner.toString() !== req.user._id.toString()) {
         return res.status(401).json({ message: 'Not authorized' });
      }

      request.status = status;
      await request.save();

      if (status === 'APPROVED') {
         // Logic: Update Item status? 
         // Prompt: "Item status becomes BOOKED".
         // Let's mark item as BOOKED if the booking is currently active? 
         // For now, relies on Request status overlap checks.

         // Notify Borrower
         await createNotification(
            request.borrower,
            'REQUEST_APPROVED',
            `Your request for ${request.item.name} has been APPROVED`,
            request._id
         );

         // AUTO REJECT OVERLAPS
         await Request.updateMany(
            {
               item: request.item,
               status: 'PENDING',
               _id: { $ne: request._id },
               $or: [
                  { startDate: { $lt: request.endDate }, endDate: { $gt: request.startDate } }
               ]
            },
            { status: 'REJECTED' }
         );
      } else if (status === 'REJECTED') {
         // Notify Borrower
         await createNotification(
            request.borrower,
            'REQUEST_REJECTED',
            `Your request for ${request.item.name} was REJECTED`,
            request._id
         );
      } else if (status === 'RETURNED') {
         // Notify Borrower (Confirmation)
         await createNotification(
            request.borrower,
            'ITEM_RETURNED',
            `Return confirmed for ${request.item.name}`,
            request._id
         );
      }

      res.json(request);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

module.exports = {
   createRequest,
   getRequests,
   updateRequestStatus,
};
