import axios from 'axios';
import { auth } from '../firebase';

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor to add Token
api.interceptors.request.use(async (config) => {
   if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
}, (error) => {
   return Promise.reject(error);
});

export default api;
