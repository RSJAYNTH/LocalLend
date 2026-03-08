import { Link } from 'react-router-dom';
import { ArrowRight, Share2, ShieldCheck, MapPin } from 'lucide-react';

const Landing = () => {
   return (
      <div className="flex flex-col min-h-screen glass-panel text-white">
         {/* Navbar */}
         <nav className="flex justify-between items-center p-6 lg:px-12 glass-panel sticky top-0 z-50">
            <div className="text-2xl font-black text-gradient-premium flex items-center gap-2 tracking-tight">
               <div className="p-2 glass-panel text-white/5 rounded-xl border border-white/10">
                  <Share2 className="w-7 h-7 text-white" />
               </div>
               LocalLend
            </div>
            <div className="flex items-center space-x-6">
               <Link to="/login" className="text-zinc-200 hover:text-zinc-900 font-semibold transition-colors hidden sm:block">Log In</Link>
               <Link to="/register" className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                  Get Started
               </Link>
            </div>
         </nav>

         {/* Hero */}
         <header className="relative flex-grow flex flex-col justify-center items-center text-center px-4 py-24 md:py-32 overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-600 rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-blob"></div>
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-amber-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 max-w-4xl mx-auto glass-panel p-10 md:p-16 rounded-3xl spotlight-card">
               <span className="inline-block py-1.5 px-4 rounded-full glass-panel text-white/5 border border-white/10 text-white text-sm font-bold tracking-wide uppercase mb-8">
                  Reimagining Ownership
               </span>
               <h1 className="text-5xl md:text-7xl font-extrabold text-zinc-100 mb-8 tracking-tight leading-tight">
                  Borrow from <span className="text-gradient-premium">Neighbors</span>. <br className="hidden md:block" />
                  Lend to <span className="text-gradient-premium">Friends</span>.
               </h1>
               <p className="text-xl md:text-2xl text-zinc-200 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                  The hyper-local marketplace for sharing everyday items within your community. Save money, reduce waste, and build trust instantly.
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/register" className="w-full sm:w-auto flex justify-center items-center gap-2 glass-panel text-white text-black px-8 py-4 rounded-full text-lg font-bold hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] transform hover:-translate-y-1">
                     Start Sharing Now <ArrowRight size={20} />
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto flex justify-center items-center px-8 py-4 rounded-full text-lg font-bold text-white  border border-white/20 hover:bg-gray-100 transition-colors">
                     Explore Items
                  </Link>
               </div>
            </div>
         </header>

         {/* Features */}
         <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full relative z-10 relative">
            <div className="text-center mb-16">
               <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-100 tracking-tight">Why Choose LocalLend?</h2>
               <div className="w-24 h-1.5 bg-zinc-600 mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 md:gap-12">
               <div className="glass-panel p-10 rounded-3xl spotlight-card group">
                  <div className="glass-panel text-white/10 border border-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-zinc-100 group-hover:scale-110 transition-transform">
                     <MapPin size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-zinc-100">Hyper-Local</h3>
                  <p className="text-zinc-200 leading-relaxed text-lg text-pretty">Find items strictly within your pincode. No long travels, just quick local pickups with neighbors you can rely on.</p>
               </div>

               <div className="glass-panel p-10 rounded-3xl spotlight-card group">
                  <div className="glass-panel text-white/10 border border-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-zinc-100 group-hover:scale-110 transition-transform">
                     <ShieldCheck size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-zinc-100">Verified Trust</h3>
                  <p className="text-zinc-200 leading-relaxed text-lg text-pretty">Every user is verified. Phone, address, and aggregate reputation scores ensure complete safety and peace of mind.</p>
               </div>

               <div className="glass-panel p-10 rounded-3xl spotlight-card group">
                  <div className="glass-panel text-white/10 border border-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-zinc-100 group-hover:scale-110 transition-transform">
                     <Share2 size={28} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-zinc-100">Easy Lending</h3>
                  <p className="text-zinc-200 leading-relaxed text-lg text-pretty">List items in seconds. Manage requests, block out unavailable dates, and track returns with our intuitive unified dashboard.</p>
               </div>
            </div>
         </section>

         {/* Footer */}
         <footer className=" border-t border-white/20 text-white py-12 text-center">
            <div className="flex justify-center items-center gap-2 mb-4 text-zinc-100 font-bold">
               <Share2 size={20} className="text-zinc-900" /> LocalLend
            </div>
            <p className="font-medium">&copy; {new Date().getFullYear()} LocalLend Inc. Built for Community.</p>
         </footer>
      </div>
   );
};

export default Landing;
