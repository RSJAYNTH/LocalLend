const express = require('express');
const router = express.Router();
const {
   createItem,
   getItems,
   getMyItems,
   getItemById,
   deleteItem,
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
   .post(protect, createItem)
   .get(protect, getItems);

router.get('/my', protect, getMyItems);

router.route('/:id')
   .get(protect, getItemById)
   .delete(protect, deleteItem);

module.exports = router;
