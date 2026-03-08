import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Requests = () => {
   const { user } = useAuth();
   const [activeTab, setActiveTab] = useState('incoming'); // incoming (owner) | outgoing (borrower)
   const [requests, setRequests] = useState([]);
   const [loading, setLoading] = useState(true);

   const fetchRequests = async () => {
      setLoading(true);
      try {
         const role = activeTab === 'incoming' ? 'owner' : 'borrower';
         const { data } = await api.get('/requests', { params: { role } });
         setRequests(data);
      } catch (error) {
         console.error(error);
      }
      setLoading(false);
   };

   useEffect(() => {
      fetchRequests();
   }, [activeTab]);

   const handleStatusUpdate = async (id, status) => {
      try {
         await api.put(`/requests/${id}`, { status });
         fetchRequests();
      } catch (error) {
         alert('Error updating status');
      }
   }

   return (
      <div className="min-h-screen /50 p-6 md:p-12">
         <div className="max-w-5xl mx-auto">
            <header className="mb-10 text-center md:text-left">
               <h1 className="text-4xl font-extrabold text-zinc-100 tracking-tight">Manage Requests</h1>
               <p className="text-white mt-2 text-lg font-medium">Keep track of your lending and borrowing activities.</p>
            </header>

            {/* Segmented Control Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-2xl mb-8 border border-white/20 w-full sm:w-fit mx-auto md:mx-0">
               <button
                  onClick={() => setActiveTab('incoming')}
                  className={`flex-1 sm:flex-none py-2.5 px-6 font-bold text-sm rounded-xl transition-all duration-300 ${activeTab === 'incoming' ? 'glass-panel text-white text-zinc-900  border border-white/20/50' : 'text-white hover:text-white'}`}
               >
                  Incoming (Lending)
               </button>
               <button
                  onClick={() => setActiveTab('outgoing')}
                  className={`flex-1 sm:flex-none py-2.5 px-6 font-bold text-sm rounded-xl transition-all duration-300 ${activeTab === 'outgoing' ? 'glass-panel text-white text-zinc-900  border border-white/20/50' : 'text-white hover:text-white'}`}
               >
                  Outgoing (Borrowing)
               </button>
            </div>

            {loading ? (
               <div className="flex flex-col items-center justify-center py-20 text-zinc-900">
                  <div className="w-10 h-10 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
                  <p className="mt-4 font-bold text-white animate-pulse">Loading requests...</p>
               </div>
            ) : requests.length === 0 ? (
               <div className="text-center py-20 glass-panel text-white rounded-3xl border border-dashed border-white/20 ">
                  <div className="w-16 h-16  rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                     <Calendar size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-100 mb-2">No active requests</h3>
                  <p className="text-white max-w-sm mx-auto font-medium">You don't have any {activeTab} requests at the moment.</p>
               </div>
            ) : (
               <div className="grid gap-6">
                  {requests.map(req => (
                     <div key={req._id} className="glass-panel text-white p-6 rounded-3xl  border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-shadow">
                        <div className="flex-grow">
                           <div className="flex flex-wrap items-center gap-3 mb-2">
                              <h3 className="font-extrabold text-xl text-zinc-100">
                                 {req.item?.name || <span className="text-zinc-200 italic font-medium">Item Deleted</span>}
                              </h3>
                              <span className={`px-3 py-1 text-xs rounded-full font-black tracking-wide uppercase  border ${req.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                                    req.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                       req.status === 'REJECTED' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                          'bg-zinc-100 text-zinc-950 border-zinc-300' // RETURNED
                                 }`}>
                                 {req.status}
                              </span>
                           </div>

                           <div className="flex items-center gap-2 text-sm text-white font-medium mb-4  w-fit px-3 py-1.5 rounded-lg border border-white/10">
                              <Calendar size={16} className="text-zinc-700" />
                              {new Date(req.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} &rarr; {new Date(req.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                           </div>

                           <div className="flex items-center gap-2 text-sm text-white font-medium">
                              {activeTab === 'incoming' ? (
                                 <div className="flex items-center gap-2">
                                    <span className="text-zinc-200">Borrower:</span>
                                    <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                                       <span className="font-bold">{req.borrower?.name || 'Unknown User'}</span>
                                       <span className="text-amber-500 text-xs">★ {req.borrower?.reputation || 0}</span>
                                    </div>
                                 </div>
                              ) : (
                                 <div className="flex items-center gap-2">
                                    <span className="text-zinc-200">Owner:</span>
                                    <span className="font-bold bg-gray-100 px-2 py-1 rounded-md">{req.owner?.name || 'Unknown User'}</span>
                                 </div>
                              )}
                           </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                           {req.status !== 'REJECTED' && (
                              <Link to={`/chat/${req._id}`} className="flex-1 md:flex-none flex items-center justify-center gap-2  p-3 rounded-xl text-zinc-200 font-bold hover:bg-gray-100 transition-colors border border-white/20">
                                 <MessageCircle size={18} /> <span className="md:hidden">Chat</span>
                              </Link>
                           )}

                           {activeTab === 'incoming' && req.status === 'PENDING' && (
                              <>
                                 <button onClick={() => handleStatusUpdate(req._id, 'APPROVED')} className="flex-1 md:flex-none bg-green-500 text-white px-5 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors  shadow-green-500/20 flex items-center justify-center gap-2">
                                    <CheckCircle size={18} /> Approve
                                 </button>
                                 <button onClick={() => handleStatusUpdate(req._id, 'REJECTED')} className="flex-1 md:flex-none bg-rose-50 text-rose-600 px-5 py-3 rounded-xl font-bold hover:bg-rose-100 transition-colors border border-rose-100 flex items-center justify-center gap-2">
                                    <XCircle size={18} /> Reject
                                 </button>
                              </>
                           )}

                           {activeTab === 'incoming' && req.status === 'APPROVED' && (
                              <button onClick={() => handleStatusUpdate(req._id, 'RETURNED')} className="w-full md:w-auto bg-zinc-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-950 transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-zinc-900/20">
                                 Mark as Returned
                              </button>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};

export default Requests;
