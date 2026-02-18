"use client"
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X, AlertCircle, ShieldCheck, Play } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [settings, setSettings] = useState({ title: 'NNAFC', trailer: '' });
  const [fights, setFights] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    async function loadData() {
      // 1. Get Site Settings
      const { data: s } = await supabase.from('site_settings').select('*');
      const { data: v } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      
      setFights(v || []);
      setSettings({
        title: s?.find(x => x.id === 'hero_title')?.value || 'NNAFC',
        trailer: s?.find(x => x.id === 'trailer_id')?.value || ''
      });

      // 2. Get User Profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(prof);
      }
    }
    loadData();
  }, []);

  // THE ACTION LOGIC: NO REDIRECTS
  const handleButtonClick = () => {
    if (profile?.is_whitelisted || profile?.is_admin) {
      window.location.href = "/archive"; // Only redirect if they PAID
    } else {
      setShowPopup(true); // Otherwise show the caked out popup
    }
  };

  return (
    <main className="min-h-screen bg-black text-white uppercase italic overflow-x-hidden font-sans">
      
      {/* HERO SECTION */}
      <section className="h-[80vh] relative flex items-center px-6 md:px-20 border-b-[12px] border-[#D20A0A] overflow-hidden">
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
          <motion.h1 
            initial={{ x: -100, opacity: 0 }} 
            animate={{ x: 0, opacity: 1 }} 
            className="text-[12vw] md:text-[140px] font-black italic leading-[0.8] mb-10 tracking-tighter drop-shadow-2xl"
          >
            {settings.title}
          </motion.h1>
          <button 
            onClick={handleButtonClick}
            className="bg-white text-black px-12 py-5 font-black italic nna-btn text-2xl hover:bg-[#D20A0A] hover:text-white transition-all shadow-[8px_8px_0px_#D20A0A]"
          >
            {profile?.is_whitelisted ? "GO TO VIDEOS" : "WATCH PROMO"}
          </button>
        </div>
      </section>

      {/* FIGHT GRID */}
      <section className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {fights.map((f) => (
          <div key={f.id} className="bg-zinc-950 border border-zinc-900 group relative">
            <div className="h-64 bg-zinc-900 flex items-center justify-center relative overflow-hidden">
              <Lock className="text-[#D20A0A] group-hover:scale-125 transition-transform duration-500" size={60} />
              <div className="absolute top-0 right-0 bg-[#D20A0A] px-4 py-1 text-[10px] font-black italic">PREMIUM ACCESS</div>
            </div>
            
            <div className="p-8">
              <h3 className="text-2xl font-black italic mb-6 leading-tight h-16 line-clamp-2">{f.title}</h3>
              
              {/* TRIGGER BUTTON: NO LINK TAG HERE */}
              <button 
                onClick={handleButtonClick}
                className="w-full bg-white text-black py-4 font-black nna-btn italic hover:bg-[#D20A0A] hover:text-white transition-all text-xl"
              >
                {profile?.is_whitelisted || profile?.is_admin ? "WATCH NOW" : "UNLOCK FOOTAGE"}
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* THE "CAKED OUT" POPUP MODAL */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Dark Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowPopup(false)}
              className="absolute inset-0 bg-black/95 backdrop-blur-md"
            />
            
            {/* Modal Content */}
            <motion.div 
              initial={{ scale: 0.8, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 50, opacity: 0 }}
              className="relative bg-zinc-900 border-t-[15px] border-[#D20A0A] p-12 max-w-xl w-full shadow-[0_0_80px_rgba(210,10,10,0.5)] text-center"
            >
              <button onClick={() => setShowPopup(false)} className="absolute top-4 right-4 text-zinc-600 hover:text-white transition">
                <X size={40} />
              </button>

              <AlertCircle className="text-[#D20A0A] mx-auto mb-6" size={80} />
              <h2 className="text-6xl font-black italic mb-4 tracking-tighter uppercase leading-none">NNA+ LOCKED</h2>
              
              <p className="text-2xl font-bold mb-8 text-zinc-300">
                PAY <span className="text-white underline decoration-[#D20A0A] decoration-8">2 AZN CASH</span> TO <br/> KAMAL OR JAMAL IN PERSON.
              </p>

              <div className="bg-black p-6 border-l-8 border-[#D20A0A] text-left mb-8 shadow-inner">
                <p className="text-[10px] font-black text-zinc-500 mb-2 tracking-[0.3em]">INSTRUCTIONS</p>
                <p className="text-lg font-bold text-white leading-tight">
                  TELL THEM TO WHITELIST YOUR FIGHTER USERNAME SO YOU CAN ACCESS THE ARCHIVES.
                </p>
              </div>

              {profile ? (
                <div className="bg-zinc-800 p-6 border border-zinc-700">
                   <p className="text-[10px] font-black text-zinc-500 mb-1 tracking-[0.2em]">YOUR FIGHTER USERNAME</p>
                   <p className="text-5xl font-black text-white italic tracking-tighter">{profile.username}</p>
                </div>
              ) : (
                <Link href="/login" className="text-[#D20A0A] font-black hover:underline italic text-xl">LOGIN TO GET WHITELISTED</Link>
              )}

              <button 
                onClick={() => setShowPopup(false)}
                className="mt-10 w-full bg-white text-black py-5 font-black italic nna-btn text-2xl hover:bg-[#D20A0A] hover:text-white transition-all shadow-[6px_6px_0px_#D20A0A]"
              >
                DISMISS
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </main>
  );
}