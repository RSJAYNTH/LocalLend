import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Send } from 'lucide-react';

const Chat = () => {
   const { requestId } = useParams();
   const { user } = useAuth();
   const [messages, setMessages] = useState([]);
   const [newMessage, setNewMessage] = useState('');
   const [loading, setLoading] = useState(true);
   const messagesEndRef = useRef(null);

   const fetchMessages = async () => {
      try {
         const { data } = await api.get(`/chat/${requestId}`);
         setMessages(data);
      } catch (error) {
         console.error(error);
      }
      setLoading(false);
   };

   useEffect(() => {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000); // Poll every 5s
      return () => clearInterval(interval);
   }, [requestId]);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   const handleSend = async (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;

      try {
         await api.post('/chat', {
            requestId,
            message: newMessage
         });
         setNewMessage('');
         fetchMessages(); // Refresh immediately
      } catch (error) {
         alert('Error sending message');
      }
   };

   return (
      <div className="h-[calc(100vh-64px)]  flex flex-col max-w-4xl mx-auto w-full md:py-6 md:px-4">
         <header className="glass-panel text-white p-4 md:p-6  border-b md:border md:rounded-t-3xl border-white/10 flex items-center justify-between sticky top-0 z-10">
            <div>
               <h1 className="text-xl md:text-2xl font-extrabold text-zinc-100 tracking-tight">Conversation</h1>
               <p className="text-sm font-medium text-white mt-0.5">Discuss details and coordinate pickup.</p>
            </div>
            {/* Optional: Add a back button here if needed */}
         </header>

         <div className="flex-grow p-4 md:p-6 overflow-y-auto space-y-6  md:border-x border-white/10 scroll-smooth">
            {loading ? (
               <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-zinc-300 border-t-zinc-900 rounded-full animate-spin"></div>
               </div>
            ) : messages.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center text-center text-zinc-200">
                  <MessageCircle size={48} className="mb-4 opacity-20" />
                  <p className="font-medium text-lg text-white">No messages yet.</p>
                  <p className="text-sm mt-1">Say hello to start coordinating!</p>
               </div>
            ) : messages.map((msg, idx) => {
               const isMe = msg.sender?._id === user?._id;
               const showAvatar = idx === 0 || messages[idx - 1].sender?._id !== msg.sender?._id;

               return (
                  <div key={idx} className={`flex items-end gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}>
                     {!isMe && showAvatar ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-200 text-zinc-950 flex items-center justify-center text-xs font-bold shrink-0  border border-zinc-300/50">
                           {msg.sender?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                     ) : !isMe && !showAvatar ? (
                        <div className="w-8 shrink-0"></div>
                     ) : null}

                     <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%] md:max-w-md`}>
                        {showAvatar && (
                           <span className={`text-xs font-bold mb-1 px-1 ${isMe ? 'text-zinc-700' : 'text-white'}`}>
                              {isMe ? 'You' : msg.sender?.name?.split(' ')[0]}
                           </span>
                        )}
                        <div className={`px-5 py-3  border ${isMe
                           ? 'bg-zinc-900 text-white rounded-2xl rounded-br-sm border-zinc-950'
                           : 'glass-panel text-white text-zinc-200 rounded-2xl rounded-bl-sm border-white/10'
                           }`}>
                           <p className="text-sm md:text-base leading-relaxed">{msg.message}</p>
                        </div>
                        <span className={`text-[10px] font-medium mt-1.5 px-1 ${isMe ? 'text-zinc-200' : 'text-zinc-200'}`}>
                           {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                     </div>
                  </div>
               );
            })}
            <div ref={messagesEndRef} />
         </div>

         <div className="glass-panel text-white p-4 md:p-6 border-t md:border md:rounded-b-3xl border-white/10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)]">
            <form onSubmit={handleSend} className="flex gap-3 max-w-3xl mx-auto">
               <input
                  type="text"
                  className="flex-grow  border border-white/20 rounded-full px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:glass-panel text-zinc-900 transition-all font-medium placeholder-gray-400 shadow-inner bg-zinc-100"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
               />
               <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-zinc-900 text-white w-12 h-12 md:w-14 md:h-auto md:px-6 rounded-full md:rounded-xl hover:bg-zinc-950 transition-colors shadow-[0_8px_30px_rgb(0,0,0,0.12)] shadow-zinc-900/20 flex items-center justify-center shrink-0 disabled:opacity-50 disabled:cursor-not-allowed group"
               >
                  <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="hidden md:inline ml-2 font-bold">Send</span>
               </button>
            </form>
         </div>
      </div>
   );
};

export default Chat;
