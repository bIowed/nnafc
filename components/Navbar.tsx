"use client"
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // RELATIVE PATH
import Link from 'next/link';
import { User, LogOut, ShieldAlert, PlayCircle } from 'lucide-react';

export default function Navbar() {
  const [profile, setProfile] = useState<any>(null);

  async function loadUser(id: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (data) setProfile(data);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadUser(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (session?.user) loadUser(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <nav className="p-4 border-b-4 border-[#D20A0A] flex justify-between items-center sticky top-0 bg-black/90 backdrop-blur-md z-[100]">
      <Link href="/" className="text-3xl font-black italic uppercase text-white tracking-tighter">
        NNA<span className="text-[#D20A0A] text-4xl">FC</span>
      </Link>

      <div className="flex gap-4 items-center font-sans">
        {profile ? (
          <div className="flex items-center gap-4">
            
            {/* NEW: VIDEOS BUTTON FOR SUBSCRIBERS */}
            {(profile.is_whitelisted || profile.is_admin) && (
              <Link href="/archive" className="flex items-center gap-1 bg-[#D20A0A] text-white px-3 py-1.5 text-[10px] font-black italic nna-btn hover:bg-white hover:text-black transition-all uppercase">
                <PlayCircle size={14} /> Videos
              </Link>
            )}

            <div className="text-right leading-tight hidden md:block">
              <p className="text-sm font-black italic text-white uppercase flex items-center justify-end gap-1">
                <User size={12} className="text-[#D20A0A]" /> {profile.username}
              </p>
              <p className={`text-[9px] font-black px-1.5 rounded ${profile.is_whitelisted ? 'bg-green-600' : 'bg-zinc-800'} text-white`}>
                {profile.is_whitelisted ? 'NNA+ ACTIVE' : 'NO SUBSCRIPTION'}
              </p>
            </div>

            {profile.is_admin && (
              <Link href="/admin" className="p-2 border border-[#D20A0A] text-[#D20A0A] hover:bg-[#D20A0A] hover:text-white transition rounded">
                <ShieldAlert size={18} />
              </Link>
            )}
            
            <button onClick={logout} className="text-zinc-600 hover:text-white transition"><LogOut size={20}/></button>
          </div>
        ) : (
          <div className="flex gap-4 font-black italic text-xs uppercase">
            <Link href="/login" className="text-zinc-500 p-2">Login</Link>
            <Link href="/register" className="bg-[#D20A0A] text-white px-5 py-2 uppercase nna-btn">Join NNA+</Link>
          </div>
        )}
      </div>
    </nav>
  );
}