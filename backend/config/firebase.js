const admin = require('firebase-admin');

const serviceAccount = {
   projectId: process.env.FIREBASE_PROJECT_ID,
   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
   privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
};

try {
   if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
      throw new Error("Missing Firebase Environment Variables (FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY)");
   }

   admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
   });

   console.log('Firebase Admin Initialized successfully');
} catch (error) {
   console.error('Firebase Admin Initialization Failed:', error.message);
}

module.exports = admin;
