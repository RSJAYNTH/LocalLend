import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Search, MapPin, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Marketplace = () => {
   const { user } = useAuth();
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);
   const [search, setSearch] = useState('');
   const [category, setCategory] = useState('');

   const fetchItems = async () => {
      setLoading(true);
      try {
         const params = {};
         if (search) params.search = search;
         if (category) params.category = category;

         const { data } = await api.get('/items', { params });
         setItems(data);
      } catch (error) {
         console.error(error);
      }
      setLoading(false);
   };

   useEffect(() => {
      fetchItems();
   }, [category]); // Search triggered by button usually, but here effect is fine for category

   const handleSearch = (e) => {
      e.preventDefault();
      fetchItems();
   }

   return (
      <div className="min-h-screen  p-6 md:p-12 pb-24">
         <header className="mb-10 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-zinc-100 tracking-tight">Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 to-zinc-900">Local Items</span></h1>
            <p className="text-white flex justify-center md:justify-start items-center gap-1.5 mt-3 text-lg font-medium bg-gray-100/50 inline-flex px-4 py-1.5 rounded-full border border-white/20">
               <MapPin size={18} className="text-zinc-700" /> Showing items near <span className="font-bold text-zinc-200">{user?.pincode}</span>
            </p>
         </header>

         {/* Search & Filter */}
         <div className="glass-panel p-5 rounded-2xl border border-white/10 mb-10 flex flex-col md:flex-row gap-4 items-center transition-all">
            <form onSubmit={handleSearch} className="flex-grow flex gap-3 w-full">
               <div className="relative flex-grow">
                  <Search className="absolute left-4 top-3.5 text-zinc-200" size={20} />
                  <input
                     type="text"
                     placeholder="What are you looking for?"
                     className="w-full glass-input rounded-xl py-3 pl-12 pr-4 outline-none"
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
               <button type="submit" className="glass-panel glass-panel text-white/10 text-white px-8 py-3 rounded-xl font-bold hover:glass-panel text-white/20 transition active:scale-95 border border-white/20">
                  Search
               </button>
            </form>
            <div className="w-full md:w-56 relative border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-4">
               <Filter className="absolute left-4 md:left-8 top-7 md:top-3.5 text-zinc-200 pointer-events-none" size={18} />
               <select
                  className="w-full glass-input rounded-xl py-3 pl-10 pr-4 outline-none appearance-none cursor-pointer"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
               >
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Tools">Tools</option>
                  <option value="Books">Books</option>
                  <option value="Sports">Sports</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Other">Other</option>
               </select>
            </div>
         </div>

         {/* Grid */}
         {loading ? (
            <div className="flex flex-col items-center justify-center py-24 text-zinc-900">
               <div className="w-12 h-12 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
               <p className="mt-4 font-bold text-white animate-pulse">Discovering local gems...</p>
            </div>
         ) : items.length === 0 ? (
            <div className="text-center py-24 glass-panel text-white rounded-3xl border border-dashed border-white/20 ">
               <div className="w-20 h-20  rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  <Search size={32} />
               </div>
               <h3 className="text-xl font-bold text-zinc-100 mb-2">No items found</h3>
               <p className="text-white max-w-sm mx-auto">We couldn't find any items matching your criteria in this area. Try adjusting your search filters.</p>
            </div>
         ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
               {items.map(item => (
                  <Link to={`/items/${item._id}`} key={item._id} className="group glass-panel spotlight-card rounded-2xl overflow-hidden hover:-translate-y-1.5 flex flex-col h-full border border-white/5">
                     <div className="relative h-56 bg-black/50 overflow-hidden">
                        {item.images && item.images[0] ? (
                           <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                        ) : (
                           <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 ">
                              <MapPin size={32} className="mb-2 opacity-50" />
                              <span className="text-xs font-semibold uppercase tracking-wider">No Image</span>
                           </div>
                        )}
                        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                           <span className="glass-panel backdrop-blur text-zinc-100 px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                              {item.category}
                           </span>
                           <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase backdrop-blur border ${!item.currentlyBooked && item.status === 'AVAILABLE' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-rose-500/20 text-rose-300 border-rose-500/30'}`}>
                              {!item.currentlyBooked && item.status === 'AVAILABLE' ? 'Available' : 'Booked'}
                           </span>
                        </div>
                     </div>
                     <div className="p-5 flex flex-col flex-grow bg-black/20">
                        <h3 className="font-extrabold text-zinc-100 text-lg mb-1 leading-tight line-clamp-2 group-hover:text-white transition-colors">{item.name}</h3>
                        {item.currentlyBooked && item.nextAvailableDate && (
                           <p className="text-xs font-bold text-rose-400 mt-1 mb-2">
                              Free to use from: {new Date(item.nextAvailableDate).toLocaleDateString()}
                           </p>
                        )}
                        <div className="mt-auto pt-4 flex justify-between items-center text-sm border-t border-white/10">
                           <div className="flex items-center gap-1.5 text-zinc-200">
                              <span className="w-6 h-6 rounded-full glass-panel text-zinc-100 flex items-center justify-center text-xs font-bold border border-white/20">
                                 {item.owner?.name?.charAt(0).toUpperCase() || '?'}
                              </span>
                              <span className="font-medium text-xs truncate max-w-[80px]">{item.owner?.name?.split(' ')[0]}</span>
                           </div>
                           <span className="flex items-center gap-1 text-amber-400 font-bold text-xs bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
                              ★ {item.owner?.reputation}
                           </span>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         )}
      </div>
   );
};

export default Marketplace;
