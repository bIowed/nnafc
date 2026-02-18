"use client"
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // RELATIVE PATH
import { motion } from 'framer-motion';
import { Play, Search } from 'lucide-react';
import Link from 'next/link';

export default function Archive() {
  const [fights, setFights] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function getFights() {
      const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (data) setFights(data);
    }
    getFights();
  }, []);

  const filteredFights = fights.filter(f => f.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-black p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b-8 border-[#D20A0A] pb-6">
          <div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">FIGHT <span className="text-[#D20A0A]">VAULT</span></h1>
            <p className="text-zinc-500 font-bold mt-2 uppercase tracking-widest">Official NNAFC Fighting Championship Archives</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
            <input 
                type="text" 
                placeholder="Search Fighter Name..." 
                className="w-full bg-zinc-900 border border-zinc-800 p-4 pl-12 text-white font-bold outline-none focus:border-[#D20A0A] transition-all"
                onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFights.map((f, i) => (
            <motion.div 
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02 }}
              className="bg-zinc-950 border border-zinc-900 p-2 group overflow-hidden"
            >
              <div className="h-52 bg-zinc-900 relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.ufc.com/themes/custom/ufc/assets/img/octagon-bg.jpg')] bg-cover opacity-10 group-hover:scale-110 transition-transform duration-700"></div>
                <Play className="text-white opacity-20 group-hover:text-[#D20A0A] group-hover:opacity-100 transition-all duration-300 z-10" size={60} />
                <div className="absolute top-0 right-0 bg-[#D20A0A] px-3 py-1 text-[10px] font-black italic text-white z-20">HD 4K</div>
              </div>
              
              <div className="p-6 bg-zinc-900">
                <h3 className="text-xl font-black italic uppercase leading-tight h-14 line-clamp-2">
                    {f.title}
                </h3>
                <Link href={`/watch/${f.id}`} className="mt-4 block w-full text-center bg-white text-black py-3 font-black nna-btn uppercase italic hover:bg-[#D20A0A] hover:text-white transition-all text-sm">
                  Watch Replay
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredFights.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-700 font-black text-4xl italic uppercase">No Fights Found</p>
          </div>
        )}
      </div>
    </div>
  );
}