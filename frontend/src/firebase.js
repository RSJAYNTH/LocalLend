import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For this mini-project, the user must provide these in .env
const firebaseConfig = {
   apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "replace-me",
   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "replace-me",
   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "replace-me",
   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "replace-me",
   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "replace-me",
   appId: import.meta.env.VITE_FIREBASE_APP_ID || "replace-me"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
