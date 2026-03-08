import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '../firebase';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);
   const [authError, setAuthError] = useState(null);

   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
         if (firebaseUser) {
            try {
               // Get Token to ensure interceptor works (or just rely on it)
               const token = await firebaseUser.getIdToken();

               // Verify/Fetch User from Backend
               const { data } = await api.post('/auth/verify', {}, {
                  headers: { Authorization: `Bearer ${token}` }
               });

               if (data.exists) {
                  setUser(data.user);
                  setAuthError(null);
               } else {
                  // User exists in Firebase but not in DB (needs registration)
                  setUser({ ...firebaseUser, needsRegistration: true });
                  setAuthError(null);
               }
            } catch (error) {
               console.error("Auth Fetch Error", error);
               setAuthError(error.response?.data?.message || "Failed to connect to backend. Server might be down or blocking connection.");
               setUser(null);
            }
         } else {
            setUser(null);
         }
         setLoading(false);
      });

      return unsubscribe;
   }, []);

   const logout = async () => {
      await firebaseSignOut(auth);
      setUser(null);
   };

   return (
      <AuthContext.Provider value={{ user, loading, logout, setUser, authError }}>
         {!loading && children}
      </AuthContext.Provider>
   );
};
