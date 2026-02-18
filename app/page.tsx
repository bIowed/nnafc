"use client"
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, AlertCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [settings, setSettings] = useState({ title: 'NNAFC', trailer: '' });
  const [fights, setFights] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function load() {
      // 1. Load Settings & Fights
      const { data: s } = await supabase.from('site_settings').select('*');
      const { data: v } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      setFights(v || []);
      setSettings({
        title: s?.find(x => x.id === 'hero_title')?.value || 'NNAFC',
        trailer: s?.find(x => x.id === 'trailer_id')?.value || ''
      });

      // 2. Get User Profile for the Modal
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(prof);
      }
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="h-[80vh] relative flex items-center px-10 md:px-20 border-b-[12px] border-[#D20A0A] overflow-hidden">
        {settings.trailer && (
          <div className="absolute inset-0 opacity-30 grayscale pointer-events-none">
            <iframe 
              className="w-full h-full scale-[1.6]"
              src={`https://www.youtube.com/embed/${settings.trailer}?autoplay=1&mute=1&controls=0&loop=1&playlist=${settings.trailer}`}
              allow="autoplay"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
          </div>
        )}
        
        <div className="relative z-10">
          <motion.h1 initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-[10vw] md:text-[120px] font-black italic leading-[0.8] mb-10 uppercase text-white tracking-tighter">
            {settings.title}
          </motion.h1>
          <Link href="/register" className="bg-white text-black px-12 py-5 font-black italic nna-btn text-2xl hover:bg-[#D20A0A] hover:text-white transition-all shadow-[6px_6px_0px_#D20A0A]">
            JOIN NNA+
          </Link>
        </div>
      </section>

      {/* FIGHT GRID */}
      <section className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {fights.map((f) => (
          <div key={f.id} className="bg-zinc-950 border border-zinc-900 group">
            <div className="h-56 bg-zinc-900 flex items-center justify-center relative">
              <Lock className="text-[#D20A0A] group-hover:scale-125 transition-transform" size={40} />
              <div className="absolute top-0 right-0 bg-[#D20A0A] px-2 py-1 text-[10px] font-black italic text-white">NNA+ EXCLUSIVE</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black italic mb-4 text-white uppercase tracking-tight line-clamp-2">{f.title}</h3>
              
              {/* BUTTON LOGIC */}
              <button 
                onClick={() => {
                  if (profile?.is_whitelisted || profile?.is_admin) {
                    window.location.href = "/archive";
                  } else {
                    setIsModalOpen(true);
                  }
                }}
                className="block w-full text-center bg-white text-black py-2 font-black nna-btn uppercase italic hover:bg-[#D20A0A] hover:text-white transition-all"
              >
                {profile?.is_whitelisted || profile?.is_admin ? "WATCH NOW" : "UNLOCK FOOTAGE"}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* PAYMENT MODAL (POPUP) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative bg-zinc-900 border-t-[12px] border-[#D20A0A] p-10 max-w-lg w-full shadow-[0_0_100px_rgba(210,10,10,0.4)] overflow-hidden"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
                <X size={30} />
              </button>

              <div className="text-center italic uppercase">
                <AlertCircle className="text-[#D20A0A] mx-auto mb-4" size={60} />
                <h2 className="text-5xl font-black mb-2 tracking-tighter">Access Locked</h2>
                <div className="h-1 w-20 bg-white mx-auto mb-8" />
                
                <p className="text-xl font-bold mb-6 text-zinc-300">
                  Pay <span className="text-white underline decoration-[#D20A0A] decoration-4 text-3xl">2 AZN CASH</span> to Kamal or Jamal in person.
                </p>

                <div className="bg-black p-6 border-l-8 border-[#D20A0A] mb-8 text-left">
                  <p className="text-xs font-black text-zinc-500 mb-2">INSTRUCTION:</p>
                  <p className="text-sm font-bold text-white leading-tight">
                    Tell them to whitelist your username so you can watch the fights instantly.
                  </p>
                </div>

                {profile ? (
                  <div className="bg-zinc-800 p-4 border border-zinc-700">
                     <p className="text-[10px] font-black text-zinc-400 mb-1 tracking-[0.2em]">YOUR FIGHTER USERNAME</p>
                     <p className="text-3xl font-black text-white">{profile.username}</p>
                  </div>
                ) : (
                  <Link href="/login" className="text-red-600 font-black hover:underline uppercase italic">Login to see username</Link>
                )}

                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="mt-8 w-full bg-white text-black py-4 font-black italic nna-btn text-xl hover:bg-[#D20A0A] hover:text-white transition-all"
                >
                  GOT IT
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}