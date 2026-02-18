"use client"
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const username = u.trim().toLowerCase();
    
    // Auth Signup - Passing metadata to the trigger
    const { data, error: authError } = await supabase.auth.signUp({
      email: `${username}@nnafc.com`,
      password: p,
      options: {
        data: {
          username: u.trim()
        }
      }
    });

    if (authError) {
      setLoading(false);
      return alert("AUTH ERROR: " + authError.message);
    }

    alert("SUCCESS! WELCOME TO NNAFC.");
    setLoading(false);
    router.push('/login');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black p-4 font-sans">
      <form onSubmit={handleRegister} className="bg-zinc-900 p-8 border-t-8 border-[#D20A0A] w-full max-w-sm">
        <h1 className="text-4xl font-black italic mb-8 uppercase text-white tracking-tighter">Enter Roster</h1>
        <input className="w-full bg-black p-4 mb-4 border border-zinc-800 text-white font-bold outline-none focus:border-[#D20A0A]" placeholder="USERNAME" onChange={e => setU(e.target.value)} required />
        <input className="w-full bg-black p-4 mb-8 border border-zinc-800 text-white font-bold outline-none focus:border-[#D20A0A]" type="password" placeholder="PASSWORD" onChange={e => setP(e.target.value)} required />
        <button disabled={loading} className="w-full bg-[#D20A0A] p-4 font-black italic uppercase text-white hover:bg-white hover:text-black transition-all disabled:opacity-50">
          {loading ? "COMMITTING..." : "JOIN NNAFC"}
        </button>
      </form>
    </div>
  );
}