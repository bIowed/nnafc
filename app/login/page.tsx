"use client"
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const router = useRouter();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const cleanUser = u.trim().toLowerCase();

    const { error } = await supabase.auth.signInWithPassword({
      email: `${cleanUser}@nnafc.com`,
      password: p,
    });

    if (error) return alert("INVALID USERNAME OR PASSWORD");

    // Success: Force hard refresh to Home to update Navbar
    window.location.href = "/"; 
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black p-4">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 border-t-8 border-[#D20A0A] w-full max-w-sm">
        <h1 className="text-4xl font-black italic mb-6 text-white uppercase tracking-tighter">Login</h1>
        <input className="w-full bg-black p-4 mb-4 border border-zinc-800 text-white font-bold" placeholder="USERNAME" onChange={e => setU(e.target.value)} required />
        <input className="w-full bg-black p-4 mb-8 border border-zinc-800 text-white font-bold" type="password" placeholder="PASSWORD" onChange={e => setP(e.target.value)} required />
        <button className="w-full bg-[#D20A0A] p-4 font-black italic uppercase text-white hover:bg-white hover:text-black transition-all">ENTER ARENA</button>
      </form>
    </div>
  );
}