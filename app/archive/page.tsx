"use client"
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion } from 'framer-motion';
import { Play, Search, VideoOff } from 'lucide-react';
import Link from 'next/link';

export default function Archive() {
  const [fights, setFights] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function getFights() {
      const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      setFights(data || []);
    }
    getFights();
  }, []);

  const filtered = fights.filter(f => f.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-black p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b-8 border-[#D20A0A] pb-6 uppercase italic">
          <div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">FIGHT <span className="text-[#D20A0A]">VAULT</span></h1>
            <p className="text-zinc-500 font-bold mt-2 tracking-widest">Premium Fighting Championship Archives</p>
          </div>
          <div className="relative w-full md:w-80">
            <input 
                type="text" 
                placeholder="SEARCH FIGHTER..." 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white font-bold outline-none focus:border-[#D20A0A]"
                onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 italic uppercase">
            {filtered.map((f, i) => (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} key={f.id} className="bg-zinc-950 border border-zinc-900 p-2 group">
                <div className="h-52 bg-zinc-900 relative flex items-center justify-center overflow-hidden">
                  <Play className="text-white opacity-20 group-hover:text-[#D20A0A] group-hover:opacity-100 transition-all z-10" size={60} />
                  <div className="absolute top-0 right-0 bg-[#D20A0A] px-3 py-1 text-[10px] font-black text-white z-20">NNA+ EXCLUSIVE</div>
                </div>
                <div className="p-6 bg-zinc-900">
                  <h3 className="text-xl font-black italic h-14 line-clamp-2 leading-tight">{f.title}</h3>
                  <Link href={`/watch/${f.id}`} className="mt-4 block w-full text-center bg-white text-black py-3 font-black nna-btn hover:bg-[#D20A0A] hover:text-white transition-all text-sm">
                    Watch Replay
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 opacity-20 italic">
            <VideoOff size={80} className="mx-auto mb-4" />
            <p className="text-4xl font-black uppercase">Archive Empty</p>
          </div>
        )}
      </div>
    </div>
  );
}