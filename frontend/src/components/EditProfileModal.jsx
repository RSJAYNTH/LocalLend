import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose }) => {
   const { user, setUser } = useAuth();
   const [formData, setFormData] = useState({
      name: user?.name || '',
      phone: user?.phone || '',
      pincode: user?.pincode || '',
      address: user?.address || '',
   });
   const [loading, setLoading] = useState(false);

   if (!isOpen) return null;

   const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         const { data } = await api.put('/auth/profile', formData);
         setUser(data); // Update context
         onClose(); // Close modal
      } catch (error) {
         alert(error.response?.data?.message || 'Error updating profile');
      }
      setLoading(false);
   };

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
         <div className="glass-panel text-white p-6 rounded-xl w-full max-w-md relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-white">
               <X size={24} />
            </button>
            <h2 className="text-xl font-bold mb-6 text-zinc-200 border-b pb-2">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block text-sm font-medium text-white mb-1">Full Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-zinc-700 outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-white mb-1">Phone Number</label>
                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-zinc-700 outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-white mb-1">Pincode</label>
                  <input name="pincode" value={formData.pincode} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-zinc-700 outline-none" />
               </div>
               <div>
                  <label className="block text-sm font-medium text-white mb-1">Address</label>
                  <textarea name="address" value={formData.address} onChange={handleChange} className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-zinc-700 outline-none h-24" />
               </div>
               <button disabled={loading} className="w-full bg-zinc-900 text-white py-2 rounded-lg font-semibold hover:bg-zinc-950 transition ">
                  {loading ? 'Saving...' : 'Save Changes'}
               </button>
            </form>
         </div>
      </div>
   );
};

export default EditProfileModal;
