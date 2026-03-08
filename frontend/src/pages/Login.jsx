import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const navigate = useNavigate();
   const { user, authError } = useAuth();

   // Redirect if user is already logged in
   useEffect(() => {
      if (user) {
         navigate('/dashboard');
      }
   }, [user, navigate]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         await signInWithEmailAndPassword(auth, email, password);
         // Navigation is handled by the useEffect above once the auth state updates
      } catch (err) {
         setError('Failed to log in: ' + err.message);
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center  px-4">
         <div className="max-w-md w-full glass-panel text-white rounded-xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-6 text-zinc-200">Welcome Back</h2>

            {authError && <div className="bg-yellow-100 text-yellow-700 p-3 rounded mb-4">Connection Error: {authError}</div>}
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-white">Email</label>
                  <input
                     type="email"
                     required
                     className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none text-zinc-900"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-white">Password</label>
                  <input
                     type="password"
                     required
                     className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none text-zinc-900"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
               </div>

               <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
               >
                  Log In
               </button>
            </form>

            <p className="mt-4 text-center text-zinc-200">
               Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
            </p>
         </div>
      </div>
   );
};

export default Login;
