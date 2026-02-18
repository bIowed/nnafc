"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic'; 

import { useEffect, useState } from 'react';


export default function Home() {
  const [settings, setSettings] = useState({ title: 'NNAFC', trailer: '' });
  const [fights, setFights] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const { data: s } = await supabase.from('site_settings').select('*');
      const title = s?.find(x => x.id === 'hero_title')?.value || 'NNAFC';
      const trailer = s?.find(x => x.id === 'trailer_id')?.value || '';
      setSettings({ title, trailer });
      
      const { data: v } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      setFights(v || []);
    }
    load();
  }, []);

  return (
    <main className="min-h-screen bg-black overflow-x-hidden">
      <section className="h-[80vh] relative flex items-center px-10 md:px-20 border-b-[12px] border-ufcRed overflow-hidden">
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
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="text-[10vw] md:text-[120px] font-black italic leading-[0.8] mb-10 uppercase text-white"
          >
            {settings?.title || settings.title}
          </motion.h1>
          <button className="bg-white text-black px-12 py-5 font-black italic nna-btn text-2xl hover:bg-ufcRed hover:text-white transition-all">
            WATCH PROMO
          </button>
        </div>
      </section>

      <section className="p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {fights.map((f) => (
          <div key={f.id} className="bg-zinc-950 border border-zinc-900 group">
            <div className="h-56 bg-zinc-900 flex items-center justify-center relative">
              <Lock className="text-ufcRed group-hover:scale-125 transition-transform" size={40} />
              <div className="absolute top-0 right-0 bg-ufcRed px-2 py-1 text-[10px] font-black italic text-white">NNA+ EXCLUSIVE</div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-black italic mb-4 text-white uppercase">{f.title}</h3>
              <Link href={`/watch/${f.id}`} className="block text-center bg-white text-black py-2 font-black nna-btn uppercase italic hover:bg-ufcRed hover:text-white transition-all">
                Unlock Footage
              </Link>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}