require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Item = require('./models/Item');

async function run() {
   try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('Connected to DB. Starting whitespace trim migration...');

      const users = await User.find({});
      let usersUpdated = 0;
      for (const user of users) {
         let changed = false;
         if (user.name && user.name !== user.name.trim()) {
            user.name = user.name.trim();
            changed = true;
         }
         if (user.pincode && user.pincode !== user.pincode.trim()) {
            user.pincode = user.pincode.trim();
            changed = true;
         }
         if (user.phone && user.phone !== user.phone.trim()) {
            user.phone = user.phone.trim();
            changed = true;
         }
         if (changed) {
            await user.save();
            usersUpdated++;
         }
      }
      console.log(`Updated ${usersUpdated} users.`);

      const items = await Item.find({});
      let itemsUpdated = 0;
      for (const item of items) {
         let changed = false;
         if (item.name && item.name !== item.name.trim()) {
            item.name = item.name.trim();
            changed = true;
         }
         if (item.pincode && item.pincode !== item.pincode.trim()) {
            item.pincode = item.pincode.trim();
            changed = true;
         }
         if (changed) {
            await item.save();
            itemsUpdated++;
         }
      }
      console.log(`Updated ${itemsUpdated} items.`);

      console.log('Migration complete.');
      process.exit(0);
   } catch (error) {
      console.error('Migration failed:', error);
      process.exit(1);
   }
}

run();
