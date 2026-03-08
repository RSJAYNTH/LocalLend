import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Edit2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import EditProfileModal from '../components/EditProfileModal';
import MyListings from '../components/MyListings';

const Dashboard = () => {
   const { user, logout } = useAuth();
   const navigate = useNavigate();
   const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

   const handleLogout = async () => {
      await logout();
      navigate('/login');
   }

   return (
      <div className="min-h-screen /50 p-6 md:p-12">
         <EditProfileModal isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />

         <div className="max-w-6xl mx-auto space-y-8">
            {/* Header Area */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center glass-panel spotlight-card p-8 rounded-3xl gap-6">
               <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-zinc-900 to-zinc-900 text-white flex items-center justify-center text-3xl font-black shadow-lg shadow-zinc-900/20">
                     {user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                     <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Welcome back, {user?.name?.split(' ')[0]}</h1>
                     <div className="flex items-center gap-4 mt-2 text-sm text-white">
                        <span className="font-medium bg-black/40 px-3 py-1 rounded-full border border-white/10">
                           Pincode: <span className="text-zinc-100 font-bold">{user?.pincode}</span>
                        </span>
                        <span className="text-amber-600 font-bold flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                           ★ Reputation: {user?.reputation}
                        </span>
                     </div>
                     <button onClick={() => setIsEditProfileOpen(true)} className="text-zinc-200 font-semibold text-sm hover:text-white flex items-center gap-1 mt-4 group transition-colors">
                        <Edit2 size={16} className="group-hover:rotate-12 transition-transform" /> Edit Profile
                     </button>
                  </div>
               </div>

               <button onClick={handleLogout} className="flex items-center gap-2 text-zinc-200 font-bold hover:text-rose-400 hover:bg-rose-500/10 px-5 py-2.5 rounded-xl transition-all w-full md:w-auto justify-center md:justify-start border border-transparent hover:border-rose-500/20">
                  <LogOut size={20} /> Logout
               </button>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
               {/* Left Column - Listings */}
               <div className="lg:col-span-8 flex flex-col gap-6">
                  <div className="glass-panel p-8 rounded-3xl flex-grow flex flex-col spotlight-card">
                     <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-6">
                        <h2 className="text-2xl font-extrabold text-zinc-100">My Listings</h2>
                        <Link to="/create-item" className="hidden sm:flex text-white glass-panel text-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm font-bold hover:glass-panel text-white/10 transition-colors items-center gap-2 hover:text-white">
                           + List New Item
                        </Link>
                     </div>

                     <div className="flex-grow">
                        <MyListings />
                     </div>

                     <div className="mt-8 pt-6 border-t border-white/10">
                        <Link to="/marketplace" className="w-full glass-panel text-white text-black px-6 py-4 rounded-xl hover:bg-zinc-200 text-center font-bold shadow-lg transform transition-transform hover:-translate-y-0.5 block">
                           Explore Marketplace
                        </Link>
                     </div>
                  </div>
               </div>

               {/* Right Column - Requests & Actions */}
               <div className="lg:col-span-4 flex flex-col gap-8">
                  <div className="glass-panel spotlight-card p-8 rounded-3xl">
                     <div className="w-12 h-12 glass-panel text-white/10 text-zinc-100 rounded-2xl flex items-center justify-center mb-5 border border-white/20">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                     </div>
                     <h2 className="text-xl font-extrabold text-zinc-100 mb-2">Manage Requests</h2>
                     <p className="text-zinc-200 mb-6 font-medium leading-relaxed">Review incoming requests for your items and track your outgoing borrows.</p>

                     <Link to="/requests" className="glass-panel text-white/10 border border-white/10 text-white px-6 py-3.5 rounded-xl font-bold hover:glass-panel text-white/20 transition-all block text-center flex items-center justify-center gap-2 group">
                        View Requests
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                     </Link>
                  </div>

                  {/* Mobile Create Item Fallback if hidden in header */}
                  <div className="sm:hidden glass-panel p-6 rounded-3xl flex flex-col items-center text-center">
                     <div className="glass-panel text-white/10 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4 border border-white/20">+</div>
                     <h3 className="font-bold text-zinc-100 mb-1 leading-tight">Got something to share?</h3>
                     <p className="text-sm text-zinc-200 mb-5 font-medium">List an item for your neighbors.</p>
                     <Link to="/create-item" className="glass-panel text-white text-black w-full px-4 py-3 rounded-xl font-bold transition-colors hover:bg-zinc-200">
                        List New Item
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
