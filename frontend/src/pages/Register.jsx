import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
   // Stage 1: Auth, Stage 2: Profile
   const [stage, setStage] = useState(1);
   const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      pincode: '',
      address: '',
   });
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);

   const navigate = useNavigate();
   const { user, authError } = useAuth(); // If user exists but needs registration, we skip stage 1

   useEffect(() => {
      if (authError) {
         setError('Backend Error: ' + authError);
         setLoading(false);
      }
      if (user && user.needsRegistration) {
         setStage(2);
         setLoading(false); // Reset loading state from previous stage
         setFormData(prev => ({ ...prev, email: user.email }));
      } else if (user && !user.needsRegistration) {
         navigate('/dashboard');
      }
   }, [user, navigate, authError]);

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleRegisterAuth = async (e) => {
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
         return setError('Passwords do not match');
      }
      setLoading(true);
      try {
         await createUserWithEmailAndPassword(auth, formData.email, formData.password);
         // Auth listener in Context will catch this and set user (needsRegistration=true)
         // Then useEffect above will switch to Stage 2
      } catch (err) {
         setError(err.message);
         setLoading(false);
      }
   };

   const handleCompleteProfile = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         await api.post('/auth/register', {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            pincode: formData.pincode,
            address: formData.address,
         });
         // Force reload or Context update? 
         // Context listener triggers on AuthStateChanged. 
         // But here auth state didn't change, only DB state.
         // We should manually update user or reload.
         // Force reload to trigger AuthContext to re-fetch user from DB
         window.location.href = '/dashboard';
      } catch (err) {
         // If 400 User already exists, maybe we just navigate?
         setError(err.response?.data?.message || err.message);
         setLoading(false);
      }
   };

   return (
      <div className="min-h-screen /50 flex flex-col items-center justify-center p-4 py-12 px-4 sm:px-6 lg:px-8">
         <div className="max-w-md w-full">
            <div className="text-center mb-10">
               <div className="mx-auto w-16 h-16 bg-zinc-100 text-zinc-900 rounded-2xl flex items-center justify-center mb-6 border border-zinc-200 ">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
               </div>
               <h2 className="text-4xl font-extrabold text-zinc-100 tracking-tight">
                  {stage === 1 ? 'Join LocalLend' : 'Almost There!'}
               </h2>
               <p className="mt-3 text-white font-medium text-lg">
                  {stage === 1 ? 'Create an account to start sharing.' : 'Complete your profile to build community trust.'}
               </p>
            </div>

            <div className="glass-panel text-white py-10 px-8 flex flex-col shadow-xl shadow-zinc-950/5 rounded-3xl border border-white/10">
               {error && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 mb-6">
                     <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     {error}
                  </div>
               )}

               {stage === 1 ? (
                  <form onSubmit={handleRegisterAuth} className="space-y-6">
                     <div>
                        <label className="block text-sm font-bold text-white mb-1.5 uppercase tracking-wide">Email Address</label>
                        <input name="email" type="email" placeholder="you@example.com" required className="w-full px-4 py-3.5  border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:glass-panel text-zinc-900 transition-all font-medium placeholder-gray-400" onChange={handleChange} />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-white mb-1.5 uppercase tracking-wide">Password</label>
                        <input name="password" type="password" placeholder="••••••••" required className="w-full px-4 py-3.5  border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:glass-panel text-zinc-900 transition-all font-medium placeholder-gray-400" onChange={handleChange} />
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-white mb-1.5 uppercase tracking-wide">Confirm Password</label>
                        <input name="confirmPassword" type="password" placeholder="••••••••" required className="w-full px-4 py-3.5  border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:glass-panel text-zinc-900 transition-all font-medium placeholder-gray-400" onChange={handleChange} />
                     </div>

                     <button disabled={loading} className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 mt-4">
                        {loading ? (
                           <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Processing...
                           </>
                        ) : 'Continue'}
                     </button>
                  </form>
               ) : (
                  <form onSubmit={handleCompleteProfile} className="space-y-5" autoComplete="off">
                     <div>
                        <label className="block text-sm font-bold text-white mb-1.5 uppercase tracking-wide">Full Name <span className="text-red-500">*</span></label>
                        <input name="name" type="text" placeholder="John Doe" required className="w-full px-4 py-3  border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:glass-panel text-zinc-900 transition-all font-medium" onChange={handleChange} autoComplete="name" />
                     </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <label className="block text-sm font-bold text-white mb-1.5 uppercase tracking-wide">Phone <span className="text-red-500">*</span></label>
                           <input name="phone" type="tel" placeholder="(555) 000-0000" required className="w-full px-4 py-3  border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:glass-panel text-zinc-900 transition-all font-medium" onChange={handleChange} autoComplete="tel" />
                        </div>
                        <div>
                           <label className="block text-sm font-bold text-white mb-1.5 uppercase tracking-wide">Pincode <span className="text-red-500">*</span></label>
                           <input name="pincode" type="text" placeholder="123456" required className="w-full px-4 py-3  border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:glass-panel text-zinc-900 transition-all font-medium" onChange={handleChange} autoComplete="postal-code" />
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-white mb-1.5 uppercase tracking-wide">Complete Address <span className="text-red-500">*</span></label>
                        <textarea name="address" placeholder="123 Main St, Apt 4B" required className="w-full px-4 py-3  border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:glass-panel text-zinc-900 transition-all font-medium resize-none h-24" onChange={handleChange} autoComplete="street-address" />
                     </div>

                     <button disabled={loading} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3.5 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition shadow-lg shadow-green-500/20 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 mt-6">
                        {loading ? (
                           <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Saving Profile...
                           </>
                        ) : 'Finish Setup'}
                     </button>
                  </form>
               )}
            </div>

            {stage === 1 && (
               <p className="mt-8 text-center text-sm text-zinc-200 font-medium">
                  Already have an account?{' '}
                  <Link to="/login" className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                     Log in instead
                  </Link>
               </p>
            )}
         </div>
      </div>
   );
};

export default Register;
