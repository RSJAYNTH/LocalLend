require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');

mongoose.connect(process.env.MONGO_URI).then(async () => {
   const users = await User.find({}, 'name email pincode firebaseUid');
   const items = await Item.find({}, 'name pincode owner status');
   console.log('--- USERS ---');
   users.forEach(u => console.log(`User: '${u.name}', Pincode: '${u.pincode}'`));
   console.log('--- ITEMS ---');
   items.forEach(i => console.log(`Item: '${i.name}', Pincode: '${i.pincode}', Owner: '${i.owner}'`));
   process.exit(0);
}).catch(err => {
   console.error(err);
   process.exit(1);
});
