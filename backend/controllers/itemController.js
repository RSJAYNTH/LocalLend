const Item = require('../models/Item');
const User = require('../models/User');
const Request = require('../models/Request');

// @desc    Create a new item listing
// @route   POST /api/items
// @access  Private
const createItem = async (req, res) => {
   const { name, description, category, images } = req.body;

   try {
      // Basic validation
      if (!name || !description || !category) {
         return res.status(400).json({ message: 'Please fill in all fields' });
      }

      const item = await Item.create({
         owner: req.user._id,
         name,
         description,
         category,
         images,
         pincode: req.user.pincode, // Auto-inherit from owner
      });

      res.status(201).json(item);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// @desc    Get items (Search/Filter)
// @route   GET /api/items
// @access  Private (Since we need user pincode to filter nearby?)
//          Actually, prompt says "Users should only see items listed within the same pincode...".
//          So we need to know WHO lies calling.
const getItems = async (req, res) => {
   try {
      const userPincode = req.user.pincode;

      // Simple filter: Same pincode
      const filter = {
         pincode: userPincode,
         status: 'AVAILABLE', // Only show available items
      };

      if (req.query.category) {
         filter.category = req.query.category;
      }

      if (req.query.search) {
         filter.$text = { $search: req.query.search };
      }

      const items = await Item.find(filter).populate('owner', 'name reputation');

      const now = new Date();
      const itemIds = items.map(i => i._id);

      // Fetch all upcoming approved requests for these items
      const upcomingRequests = await Request.find({
         item: { $in: itemIds },
         status: 'APPROVED',
         endDate: { $gte: now }
      }).sort({ startDate: 1 }).select('item startDate endDate');

      // Group requests by item ID
      const requestsByItem = {};
      upcomingRequests.forEach(req => {
         const itemId = req.item.toString();
         if (!requestsByItem[itemId]) {
            requestsByItem[itemId] = [];
         }
         requestsByItem[itemId].push(req);
      });

      // Attach availability data to each item
      const enrichedItems = items.map(itemDoc => {
         const itemData = itemDoc.toObject();
         const itemRequests = requestsByItem[itemData._id.toString()] || [];

         let nextAvailableDate = null;
         let currentlyBooked = false;

         if (itemRequests.length > 0) {
            let currentDate = new Date();

            // Check if it's booked right now
            currentlyBooked = itemRequests.some(
               req => new Date(req.startDate) <= currentDate && new Date(req.endDate) >= currentDate
            );

            if (currentlyBooked || itemData.status !== 'AVAILABLE') {
               let possibleAvailableDate = new Date();

               for (let i = 0; i < itemRequests.length; i++) {
                  const req = itemRequests[i];
                  const reqStart = new Date(req.startDate);
                  const reqEnd = new Date(req.endDate);

                  if (possibleAvailableDate >= reqStart && possibleAvailableDate <= reqEnd) {
                     possibleAvailableDate = new Date(reqEnd);
                     possibleAvailableDate.setDate(possibleAvailableDate.getDate() + 1); // Next day
                  } else if (possibleAvailableDate < reqStart) {
                     break;
                  }
               }
               nextAvailableDate = possibleAvailableDate;
            }
         }

         itemData.currentlyBooked = currentlyBooked;
         itemData.nextAvailableDate = nextAvailableDate;

         return itemData;
      });

      res.json(enrichedItems);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// @desc    Get my items
// @route   GET /api/items/my
// @access  Private
const getMyItems = async (req, res) => {
   try {
      const items = await Item.find({ owner: req.user._id });

      const now = new Date();
      const itemIds = items.map(i => i._id);

      // Fetch all upcoming approved requests for these items
      const upcomingRequests = await Request.find({
         item: { $in: itemIds },
         status: 'APPROVED',
         endDate: { $gte: now }
      }).sort({ startDate: 1 }).select('item startDate endDate');

      // Group requests by item ID
      const requestsByItem = {};
      upcomingRequests.forEach(req => {
         const itemId = req.item.toString();
         if (!requestsByItem[itemId]) {
            requestsByItem[itemId] = [];
         }
         requestsByItem[itemId].push(req);
      });

      // Attach availability data to each item
      const enrichedItems = items.map(itemDoc => {
         const itemData = itemDoc.toObject();
         const itemRequests = requestsByItem[itemData._id.toString()] || [];

         let nextAvailableDate = null;
         let currentlyBooked = false;

         if (itemRequests.length > 0) {
            let currentDate = new Date();

            // Check if it's booked right now
            currentlyBooked = itemRequests.some(
               req => new Date(req.startDate) <= currentDate && new Date(req.endDate) >= currentDate
            );

            if (currentlyBooked || itemData.status !== 'AVAILABLE') {
               let possibleAvailableDate = new Date();

               for (let i = 0; i < itemRequests.length; i++) {
                  const req = itemRequests[i];
                  const reqStart = new Date(req.startDate);
                  const reqEnd = new Date(req.endDate);

                  if (possibleAvailableDate >= reqStart && possibleAvailableDate <= reqEnd) {
                     possibleAvailableDate = new Date(reqEnd);
                     possibleAvailableDate.setDate(possibleAvailableDate.getDate() + 1); // Next day
                  } else if (possibleAvailableDate < reqStart) {
                     break;
                  }
               }
               nextAvailableDate = possibleAvailableDate;
            }
         }

         itemData.currentlyBooked = currentlyBooked;
         itemData.nextAvailableDate = nextAvailableDate;

         return itemData;
      });

      res.json(enrichedItems);
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Private
const getItemById = async (req, res) => {
   try {
      const item = await Item.findById(req.params.id).populate('owner', 'name reputation');
      if (item) {
         // Also fetch upcoming APPROVED requests to calculate next availability and block dates
         const now = new Date();
         const upcomingRequests = await Request.find({
            item: item._id,
            status: 'APPROVED',
            endDate: { $gte: now }
         }).sort({ startDate: 1 }).select('startDate endDate');

         let nextAvailableDate = null;

         // If item has upcoming bookings, we need to find the earliest gap or the end of the last booking
         if (upcomingRequests.length > 0) {
            let currentDate = new Date();

            // Check if it's booked right now
            const currentlyBooked = upcomingRequests.some(
               req => new Date(req.startDate) <= currentDate && new Date(req.endDate) >= currentDate
            );

            if (currentlyBooked || item.status !== 'AVAILABLE') {
               // It's currently booked, find the next free slot
               // A simple approach: the end date of the last overlapping booking
               // To be perfectly accurate, we should find the first gap between bookings that is >= 1 day.
               // For now, let's just take the end of the last known booking + 1 day as a safe bet,
               // or the first gap we find.

               let possibleAvailableDate = new Date();

               for (let i = 0; i < upcomingRequests.length; i++) {
                  const req = upcomingRequests[i];
                  const reqStart = new Date(req.startDate);
                  const reqEnd = new Date(req.endDate);

                  if (possibleAvailableDate >= reqStart && possibleAvailableDate <= reqEnd) {
                     // We are inside a booking, move our possible date to the end of it
                     possibleAvailableDate = new Date(reqEnd);
                     possibleAvailableDate.setDate(possibleAvailableDate.getDate() + 1); // Next day
                  } else if (possibleAvailableDate < reqStart) {
                     // We found a gap before the next booking!
                     break;
                  }
               }
               nextAvailableDate = possibleAvailableDate;
            }
         }

         const itemData = item.toObject();
         itemData.upcomingBookings = upcomingRequests;
         itemData.nextAvailableDate = nextAvailableDate;

         res.json(itemData);
      } else {
         res.status(404).json({ message: 'Item not found' });
      }
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

// @desc    Delete an item
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res) => {
   try {
      const item = await Item.findById(req.params.id);

      if (!item) {
         return res.status(404).json({ message: 'Item not found' });
      }

      // Check user
      if (item.owner.toString() !== req.user._id.toString()) {
         return res.status(401).json({ message: 'User not authorized' });
      }

      await item.deleteOne();
      res.json({ message: 'Item removed' });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};

module.exports = {
   createItem,
   getItems,
   getMyItems,
   getItemById,
   deleteItem,
};
