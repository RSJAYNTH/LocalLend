const admin = require('../config/firebase');
const User = require('../models/User');

const protect = async (req, res, next) => {
   let token;

   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
   ) {
      try {
         token = req.headers.authorization.split(' ')[1];

         // Verify token with Firebase Admin
         const decodedToken = await admin.auth().verifyIdToken(token);

         req.firebaseUser = decodedToken;

         // Find user in our DB
         const user = await User.findOne({ firebaseUid: decodedToken.uid });

         // If user exists, attach to req
         if (user) {
            req.user = user;
         }
         // If user NOT found, we still allow passing through for 'register' route, 
         // but for other protected routes we might want to fail?
         // For now, let's just attach firebaseUser and let the controller decide if it needs DB user.

         next();
      } catch (error) {
         console.error('Auth Error:', error);
         res.status(401).json({ message: 'Not authorized, token failed' });
      }
   } else {
      res.status(401).json({ message: 'Not authorized, no token' });
   }
};

module.exports = { protect };
