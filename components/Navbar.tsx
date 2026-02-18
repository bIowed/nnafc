"use client"
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { User, LogOut, Settings } from 'lucide-react';

export default function Navbar() {
  const [profile, setProfile] = useState<any>(null);

  async function fetchProfile(id: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (data) setProfile(data);
  }

  useEffect(() => {
    // 1. Initial check
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) fetchProfile(user.id);
    });

    // 2. Continuous Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="p-4 border-b-4 border-[#D20A0A] flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur-md z-[100]">
      <Link href="/" className="text-3xl font-black italic uppercase tracking-tighter text-white">
        NNA<span className="text-[#D20A0A] text-4xl">FC</span>
      </Link>

      <div className="flex gap-4 items-center">
        {profile ? (
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-black italic uppercase text-white flex items-center gap-1">
                 {profile.username}
              </span>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${profile.is_whitelisted ? 'bg-green-600' : 'bg-zinc-800'} text-white italic`}>
                {profile.is_whitelisted ? 'NNA+ ACTIVE' : 'NO SUBSCRIPTION'}
              </span>
            </div>
            {profile.is_admin && (
              <Link href="/admin" className="p-2 bg-zinc-900 border border-[#D20A0A] text-[#D20A0A] hover:bg-[#D20A0A] hover:text-white transition rounded">
                <Settings size={18} />
              </Link>
            )}
            <button onClick={() => supabase.auth.signOut()} className="text-zinc-500 hover:text-white transition">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="flex gap-4 font-black italic text-xs uppercase">
            <Link href="/login" className="text-zinc-400 hover:text-white p-2">Login</Link>
            <Link href="/register" className="bg-[#D20A0A] text-white px-4 py-2 italic slant">Join NNA+</Link>
          </div>
        )}
      </div>
    </nav>
  );
}