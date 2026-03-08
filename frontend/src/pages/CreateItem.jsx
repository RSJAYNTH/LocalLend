import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const CreateItem = () => {
   const [formData, setFormData] = useState({
      name: '',
      description: '',
      category: 'Other',
      imageUrl: '', // Simple URL input for now
   });
   const [loading, setLoading] = useState(false);
   const navigate = useNavigate();

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      try {
         await api.post('/items', {
            ...formData,
            images: formData.imageUrl ? [formData.imageUrl] : []
         });
         navigate('/dashboard');
      } catch (error) {
         alert(error.message);
      }
      setLoading(false);
   };

   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

   return (
      <div className="min-h-screen /50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
         <div className="max-w-xl w-full glass-panel text-white p-8 md:p-10 rounded-3xl shadow-xl shadow-zinc-950/5 border border-white/10">
            <div className="text-center mb-8">
               <div className="mx-auto w-16 h-16 bg-zinc-100 text-zinc-900 rounded-2xl flex items-center justify-center mb-4 border border-zinc-200 ">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
               </div>
               <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight">List an Item</h2>
               <p className="mt-2 text-white font-medium text-lg">Share with your neighbors and earn reputation.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               <div className="space-y-5">
                  <div>
                     <label className="block text-sm font-bold text-white mb-1.5 uppercase tracking-wide">Item Name <span className="text-red-500">*</span></label>
                     <input
                        required
                        name="name"
                        placeholder="e.g. Bosch Power Drill"
                        onChange={handleChange}
                        className="w-full px-4 py-3  border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:glass-panel text-white focus:border-transparent transition-all font-medium text-zinc-200 placeholder-gray-400"
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-bold text-white mb-1.5 uppercase tracking-wide">Description <span className="text-red-500">*</span></label>
                     <textarea
                        required
                        name="description"
                        placeholder="Describe the condition, usage, and any accessories included."
                        onChange={handleChange}
                        className="w-full px-4 py-3  border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:glass-panel text-white focus:border-transparent transition-all font-medium text-zinc-200 placeholder-gray-400 resize-none"
                        rows="4"
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div>
                        <label className="block text-sm font-bold text-white mb-1.5 uppercase tracking-wide">Category <span className="text-red-500">*</span></label>
                        <div className="relative">
                           <select
                              name="category"
                              onChange={handleChange}
                              className="w-full pl-4 pr-10 py-3  border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:glass-panel text-white focus:border-transparent transition-all font-medium text-zinc-200 appearance-none cursor-pointer"
                           >
                              <option value="Electronics">Electronics</option>
                              <option value="Tools">Tools</option>
                              <option value="Books">Books</option>
                              <option value="Sports">Sports</option>
                              <option value="Clothing">Clothing</option>
                              <option value="Other">Other</option>
                           </select>
                           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                           </div>
                        </div>
                     </div>

                     <div>
                        <label className="block text-sm font-bold text-white mb-1.5 uppercase tracking-wide">Image URL <span className="text-zinc-200 font-normal normal-case">(Optional)</span></label>
                        <input
                           name="imageUrl"
                           onChange={handleChange}
                           placeholder="https://..."
                           className="w-full px-4 py-3  border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-700 focus:glass-panel text-white focus:border-transparent transition-all font-medium text-zinc-200 placeholder-gray-400"
                        />
                     </div>
                  </div>
               </div>

               <div className="flex flex-col-reverse sm:flex-row gap-4 pt-4 border-t border-white/10">
                  <button
                     type="button"
                     onClick={() => navigate(-1)}
                     className="w-full sm:w-1/3 px-6 py-3.5 bg-gray-100 text-white rounded-xl font-bold hover:bg-gray-200 transition-colors text-center"
                  >
                     Cancel
                  </button>
                  <button
                     disabled={loading}
                     type="submit"
                     className="w-full sm:w-2/3 flex justify-center items-center gap-2 bg-gradient-to-r from-zinc-900 to-zinc-900 text-white px-6 py-3.5 rounded-xl font-bold hover:from-zinc-950 hover:to-zinc-950 transition shadow-lg shadow-zinc-900/20 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                  >
                     {loading ? (
                        <>
                           <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                           Listing...
                        </>
                     ) : 'Publish Listing'}
                  </button>
               </div>
            </form>
         </div>
      </div>
   );
};

export default CreateItem;
