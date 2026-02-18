"use client"
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Search, VideoOff, Lock, X, Maximize } from 'lucide-react';

export default function Archive() {
  const [fights, setFights] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [watermarkPos, setWatermarkPos] = useState({ x: 10, y: 10 });

  useEffect(() => {
    async function loadData() {
      // 1. Get User Profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(prof);
      }
      // 2. Get Fights
      const { data: v } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      setFights(v || []);
    }
    loadData();

    // Moving Watermark Logic
    const interval = setInterval(() => {
      setWatermarkPos({ x: Math.random() * 70, y: Math.random() * 70 });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const filtered = fights.filter(f => f.title.toLowerCase().includes(search.toLowerCase()));
  const hasAccess = profile?.is_whitelisted || profile?.is_admin;

  return (
    <div className="min-h-screen bg-black p-4 md:p-12 text-white uppercase italic">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12 border-b-8 border-[#D20A0A] pb-6">
          <div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">FIGHT <span className="text-[#D20A0A]">VAULT</span></h1>
            <p className="text-zinc-500 font-bold mt-2 tracking-widest">Official NNAFC Premium Archives</p>
          </div>
          <div className="relative w-full md:w-80 font-sans">
            <input 
                type="text" 
                placeholder="SEARCH FIGHTER..." 
                className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white font-bold outline-none focus:border-[#D20A0A] italic uppercase"
                onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* FIGHT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((f, i) => {
            const isPlaying = activeVideoId === f.id;

            return (
              <motion.div 
                key={f.id} 
                layout
                className={`bg-zinc-950 border border-zinc-900 p-2 group overflow-hidden transition-all ${isPlaying ? 'lg:col-span-2 row-span-2' : ''}`}
              >
                <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                  
                  {/* CASE 1: VIDEO IS ACTIVELY PLAYING */}
                  {isPlaying && hasAccess ? (
                    <div className="relative w-full h-full">
                        {/* WATERMARK */}
                        <motion.div 
                          animate={{ left: `${watermarkPos.x}%`, top: `${watermarkPos.y}%` }}
                          className="absolute z-50 pointer-events-none opacity-20 text-[10px] font-mono text-white select-none whitespace-nowrap"
                        >
                          NNAFC // {profile.username} // ID:{profile.id.slice(0,5)}
                        </motion.div>
                        
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${f.youtube_id}?rel=0&modestbranding=1&autoplay=1&allowfullscreen=1`}
                          allowFullScreen
                        ></iframe>

                        <button 
                            onClick={() => setActiveVideoId(null)}
                            className="absolute top-2 right-2 z-[60] bg-black/80 p-2 hover:bg-red-600 transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                  ) 
                  
                  /* CASE 2: USER IS PLAYING BUT ACCESS IS DENIED */
                  : isPlaying && !hasAccess ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-zinc-950 border-2 border-red-600">
                        <Lock className="text-red-600 mb-4" size={40} />
                        <p className="font-black text-xl mb-2">ACCESS DENIED</p>
                        <p className="text-[10px] text-zinc-500 leading-tight">GIVE 2 AZN CASH TO KAMAL OR JAMAL TO UNLOCK THIS FOOTAGE.</p>
                        <button onClick={() => setActiveVideoId(null)} className="mt-4 text-[10px] underline">BACK</button>
                    </div>
                  )
                  
                  /* CASE 3: DEFAULT THUMBNAIL STATE */
                  : (
                    <div className="h-full flex items-center justify-center relative cursor-pointer" onClick={() => setActiveVideoId(f.id)}>
                        <div className="absolute inset-0 bg-[url('https://www.ufc.com/themes/custom/ufc/assets/img/octagon-bg.jpg')] bg-cover opacity-10"></div>
                        <Play className="text-white opacity-20 group-hover:text-[#D20A0A] group-hover:opacity-100 transition-all z-10" size={60} />
                        <div className="absolute top-0 right-0 bg-[#D20A0A] px-3 py-1 text-[10px] font-black text-white z-20">NNA+ PREMIUM</div>
                    </div>
                  )}
                </div>
                
                <div className="p-6 bg-zinc-900 flex justify-between items-center">
                  <h3 className="text-xl font-black italic uppercase leading-tight truncate pr-4">
                      {f.title}
                  </h3>
                  {!isPlaying && (
                    <button 
                      onClick={() => setActiveVideoId(f.id)}
                      className="bg-white text-black px-4 py-2 font-black nna-btn hover:bg-[#D20A0A] hover:text-white text-xs transition-all shrink-0"
                    >
                      WATCH
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-40 opacity-20">
            <VideoOff size={80} className="mx-auto mb-4" />
            <p className="text-4xl font-black uppercase italic">Archive Empty</p>
          </div>
        )}
      </div>
    </div>
  );
}