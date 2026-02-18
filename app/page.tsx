"use client"
import { motion } from 'framer-motion';
import { Lock, Play } from 'lucide-react';

export default function Home() {
  return (
    <main className="bg-black min-h-screen text-white">
      {/* Hero */}
      <div className="relative h-[80vh] flex items-center px-10 border-b border-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595079676339-1534802ad6cf?q=80&w=2000')] bg-cover opacity-30 grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        
        <div className="relative z-10">
          <motion.h1 initial={{ x: -100 }} animate={{ x: 0 }} className="text-[120px] font-black italic uppercase leading-[0.8] tracking-tighter">
            NNA<span className="text-red-600">FC</span><br/>FIGHTING
          </motion.h1>
          <div className="mt-10 flex gap-4">
            <button className="bg-red-600 px-10 py-4 font-black italic uppercase text-xl skew-x-[-12deg] hover:bg-white hover:text-black transition">Watch Trailer</button>
            <a href="/register" className="border-2 border-white px-10 py-4 font-black italic uppercase text-xl skew-x-[-12deg] hover:bg-red-600 hover:border-red-600 transition">Join NNA+</a>
          </div>
        </div>
      </div>

      {/* Fight Grid */}
      <section className="p-10">
        <h2 className="text-4xl font-black italic uppercase mb-10 border-l-8 border-red-600 pl-4">Premium Fights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[1, 2, 3].map(i => (
             <div key={i} className="bg-zinc-950 border border-zinc-900 group cursor-pointer overflow-hidden">
                <div className="h-48 bg-zinc-900 flex items-center justify-center relative">
                  <Lock className="text-red-600 group-hover:scale-110 transition" size={48} />
                  <div className="absolute bottom-2 right-2 bg-red-600 px-2 py-1 text-[10px] font-bold">2 AZN ACCESS</div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-black italic uppercase">Championship Fight #{i}</h3>
                  <p className="text-zinc-500 text-xs mt-2 uppercase font-bold tracking-widest">Whitelist Required</p>
                </div>
             </div>
           ))}
        </div>
      </section>
    </main>
  );
}