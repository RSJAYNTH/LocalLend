import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, User, Shield, Info, Clock, AlertTriangle } from 'lucide-react';

const ItemDetail = () => {
   const { id } = useParams();
   const { user } = useAuth();
   const navigate = useNavigate();
   const [item, setItem] = useState(null);
   const [loading, setLoading] = useState(true);

   const [startDate, setStartDate] = useState('');
   const [endDate, setEndDate] = useState('');
   const [requestLoading, setRequestLoading] = useState(false);
   const [dateError, setDateError] = useState('');

   useEffect(() => {
      const fetchItem = async () => {
         try {
            const { data } = await api.get(`/items/${id}`);
            setItem(data);
         } catch (error) {
            console.error(error);
         }
         setLoading(false);
      };
      fetchItem();
   }, [id]);

   const validateDates = () => {
      setDateError('');
      if (!startDate || !endDate) return false;

      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end < start) {
         setDateError('End date cannot be before start date.');
         return false;
      }

      // Check for overlaps with upcoming bookings
      if (item?.upcomingBookings && item.upcomingBookings.length > 0) {
         for (const booking of item.upcomingBookings) {
            const bStart = new Date(booking.startDate);
            const bEnd = new Date(booking.endDate);

            if (start <= bEnd && end >= bStart) {
               setDateError('Selected dates overlap with an existing booking.');
               return false;
            }
         }
      }
      return true;
   };

   useEffect(() => {
      validateDates();
   }, [startDate, endDate]);

   const handleRequest = async (e) => {
      e.preventDefault();

      if (!validateDates()) return;

      setRequestLoading(true);
      try {
         await api.post('/requests', {
            itemId: id,
            startDate,
            endDate
         });
         alert('Request sent successfully!');
         navigate('/requests'); // Redirect to requests page
      } catch (error) {
         alert(error.response?.data?.message || error.message);
      }
      setRequestLoading(false);
   };

   if (loading) return (
      <div className="min-h-screen  flex items-center justify-center">
         <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-zinc-700 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-white font-medium">Loading details...</p>
         </div>
      </div>
   );

   if (!item) return (
      <div className="min-h-screen  flex items-center justify-center">
         <div className="text-center">
            <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
            <h2 className="text-2xl font-bold text-zinc-200 mb-2">Item Not Found</h2>
            <button onClick={() => navigate(-1)} className="text-zinc-900 hover:underline">Go Back</button>
         </div>
      </div>
   );

   const isOwner = user?._id === item.owner?._id;

   // Logic for minimum date selection
   const getTodayString = () => {
      const today = new Date();
      return today.toISOString().split('T')[0];
   };

   const formatDate = (dateString) => {
      if (!dateString) return '';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
   };

   const isCurrentlyAvailable = item.status === 'AVAILABLE' &&
      (!item.upcomingBookings ||
         !item.upcomingBookings.some(b => new Date(b.startDate) <= new Date() && new Date(b.endDate) >= new Date()));

   return (
      <div className="min-h-screen  p-4 sm:p-6 lg:p-8 flex justify-center font-sans py-10">
         <div className="max-w-5xl w-full">
            <button
               onClick={() => navigate(-1)}
               className="mb-6 text-zinc-900 hover:text-zinc-950 flex items-center gap-2 font-medium transition-colors group"
            >
               <span className="transform group-hover:-translate-x-1 transition-transform inline-block">&larr;</span>
               Back to explore
            </button>

            <div className="glass-panel text-white rounded-[2rem] shadow-2xl shadow-zinc-950/5 overflow-hidden flex flex-col lg:flex-row">
               {/* Image Section - Left */}
               <div className="lg:w-1/2 relative bg-gray-100 min-h-[300px] lg:min-h-full">
                  {item.images && item.images[0] ? (
                     <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 hover:scale-105"
                     />
                  ) : (
                     <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-zinc-200">
                        <div className="glass-panel text-white p-6 rounded-full  mb-4">
                           <MapPin size={40} className="text-white" />
                        </div>
                        <span className="text-base font-medium">No Image Uploaded</span>
                     </div>
                  )}
                  {/* Status Badge Overlay */}
                  <div className="absolute top-6 left-6 flex gap-2">
                     <span className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md ${isCurrentlyAvailable ? 'bg-green-500/90 text-white' : 'bg-rose-500/90 text-white'}`}>
                        {isCurrentlyAvailable ? 'Available Now' : 'Currently Booked'}
                     </span>
                  </div>
               </div>

               {/* Details Section - Right */}
               <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col glass-panel text-white">
                  <div className="flex-grow">
                     <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4 text-sm font-medium">
                           <span className="text-zinc-900 bg-zinc-100 px-3 py-1 rounded-full">{item.category}</span>
                           <span className="text-white">•</span>
                           <span className="text-white flex items-center gap-1.5"><MapPin size={16} className="text-zinc-200" /> {item.pincode}</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-100 tracking-tight mb-4">{item.name}</h1>

                        {/* Availability Info Block */}
                        {!isCurrentlyAvailable && item.nextAvailableDate && (
                           <div className="flex items-start gap-3 p-4 mb-6 bg-amber-50 rounded-xl border border-amber-100">
                              <Clock className="text-amber-500 shrink-0 mt-0.5" size={20} />
                              <div>
                                 <p className="text-sm font-bold text-amber-800">Next Available</p>
                                 <p className="text-sm text-amber-700">This item will be available starting <strong className="font-extrabold">{formatDate(item.nextAvailableDate)}</strong>.</p>
                              </div>
                           </div>
                        )}

                        <p className="text-zinc-200 text-base lg:text-lg leading-relaxed mb-8">{item.description}</p>
                     </div>

                     <hr className="border-white/10 mb-8" />

                     {/* Owner Info Profile Card */}
                     <div className="flex items-center gap-4 mb-10 group cursor-pointer">
                        <div className="w-14 h-14 bg-gradient-to-tr from-zinc-700 to-zinc-900 rounded-full flex items-center justify-center shadow-lg shadow-zinc-700/30 text-white font-bold text-xl transition-transform group-hover:scale-110">
                           {item.owner?.name?.charAt(0).toUpperCase() || <User />}
                        </div>
                        <div>
                           <p className="text-xs text-zinc-200 uppercase font-bold tracking-widest mb-0.5">Listed By</p>
                           <p className="font-bold text-zinc-100 text-lg group-hover:text-zinc-900 transition-colors">{item.owner?.name}</p>
                           <p className="text-sm text-green-600 font-medium flex items-center gap-1.5 mt-0.5">
                              <Shield size={14} /> Reputation Score: {item.owner?.reputation}
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Action Area */}
                  <div className="mt-8  rounded-2xl p-1">
                     {isOwner ? (
                        <div className="p-6 text-center text-white text-sm font-medium flex flex-col items-center justify-center gap-2">
                           <Info size={24} className="text-white" />
                           You own this item.
                        </div>
                     ) : (
                        <form onSubmit={handleRequest} className="glass-panel text-white p-6 rounded-xl border border-white/10 ">
                           <h3 className="font-bold text-zinc-100 mb-5 flex items-center gap-2 text-lg">
                              <Calendar size={20} className="text-zinc-900" />
                              Select Dates
                           </h3>

                           {/* Upcoming Bookings Insight */}
                           {item.upcomingBookings && item.upcomingBookings.length > 0 && (
                              <div className="mb-4 text-xs text-white  p-3 rounded-lg border border-white/10">
                                 <strong className="block text-white mb-1">Upcoming unavailable dates:</strong>
                                 <ul className="list-disc pl-4 space-y-0.5">
                                    {item.upcomingBookings.map((b, i) => (
                                       <li key={i}>{formatDate(b.startDate)} - {formatDate(b.endDate)}</li>
                                    ))}
                                 </ul>
                              </div>
                           )}

                           <div className="grid grid-cols-2 gap-4 mb-2">
                              <div>
                                 <label className="block text-xs font-bold text-zinc-200 mb-2 uppercase tracking-wide">From <span className="text-red-500">*</span></label>
                                 <input
                                    type="date"
                                    required
                                    min={getTodayString()}
                                    className="w-full px-4 py-2.5 glass-panel text-white border border-white/20 rounded-lg text-sm text-zinc-200 focus:ring-2 focus:ring-zinc-700 focus:border-zinc-700 outline-none transition-shadow  hover:border-zinc-400"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                 />
                              </div>
                              <div>
                                 <label className="block text-xs font-bold text-zinc-200 mb-2 uppercase tracking-wide">To <span className="text-red-500">*</span></label>
                                 <input
                                    type="date"
                                    required
                                    min={startDate || getTodayString()}
                                    className="w-full px-4 py-2.5 glass-panel text-white border border-white/20 rounded-lg text-sm text-zinc-200 focus:ring-2 focus:ring-zinc-700 focus:border-zinc-700 outline-none transition-shadow  hover:border-zinc-400"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                 />
                              </div>
                           </div>

                           {/* Error message */}
                           {dateError && (
                              <div className="mb-4 mt-2 text-xs font-medium text-red-500 flex items-center gap-1.5 animate-pulse">
                                 <AlertTriangle size={14} /> {dateError}
                              </div>
                           )}

                           <div className="mt-6 pt-6 border-t border-white/10">
                              <button
                                 type="submit"
                                 disabled={requestLoading || !!dateError || !startDate || !endDate}
                                 className="w-full bg-zinc-900 text-white py-3.5 px-4 rounded-xl font-bold text-base hover:bg-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-zinc-900/30 active:scale-[0.98] flex items-center justify-center gap-2"
                              >
                                 {requestLoading ? (
                                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Sending Request...</>
                                 ) : 'Confirm Request'}
                              </button>
                           </div>
                        </form>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ItemDetail;
