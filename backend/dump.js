require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');

mongoose.connect(process.env.MONGO_URI).then(async () => {
   const users = await User.find({}, 'name email pincode firebaseUid');
   const items = await Item.find({}, 'name pincode owner status');
   console.log('--- USERS ---');
   console.dir(users, { depth: null });
   console.log('--- ITEMS ---');
   console.dir(items, { depth: null });
   process.exit(0);
}).catch(err => {
   console.error(err);
   process.exit(1);
});
