import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyListings = () => {
   const [items, setItems] = useState([]);
   const [loading, setLoading] = useState(true);

   const fetchItems = async () => {
      try {
         // Assuming we have an endpoint for my items or filter by owner
         // Based on backend implementation we might need to add logic or use /items?owner=me
         // Let's check api but for now assuming we will add /items/my-items route
         const { data } = await api.get('/items/my');
         setItems(data);
      } catch (error) {
         console.error(error);
      }
      setLoading(false);
   };

   useEffect(() => {
      fetchItems();
   }, []);

   const handleDelete = async (id) => {
      if (!confirm('Are you sure you want to delete this item?')) return;
      try {
         await api.delete(`/items/${id}`);
         setItems(items.filter(item => item._id !== id));
      } catch (error) {
         alert('Error deleting item');
      }
   };

   if (loading) return <p className="text-white text-sm">Loading items...</p>;
   if (items.length === 0) return <p className="text-white text-sm">You haven't listed any items yet.</p>;

   return (
      <div className="space-y-4 mt-4">
         {items.map(item => (
            <div key={item._id} className="flex justify-between items-center  p-3 rounded-lg border">
               <div className="flex items-center gap-3">
                  {item.images[0] && <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded object-cover" />}
                  <div>
                     <h4 className="font-semibold text-zinc-200">{item.name}</h4>
                     <p className={`text-xs ${item.currentlyBooked ? 'text-rose-500 font-bold' : 'text-white capitalize'}`}>
                        {item.currentlyBooked ? 'Booked' : item.status}
                     </p>
                     {item.currentlyBooked && item.nextAvailableDate && (
                        <p className="text-[10px] text-rose-400 font-medium mt-0.5">
                           Free from: {new Date(item.nextAvailableDate).toLocaleDateString()}
                        </p>
                     )}
                  </div>
               </div>
               <div className="flex items-center gap-3">
                  <Link to={`/items/${item._id}`} className="text-zinc-900 text-sm hover:underline">View</Link>
                  <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700">
                     <Trash2 size={18} />
                  </button>
               </div>
            </div>
         ))}
      </div>
   );
};

export default MyListings;
