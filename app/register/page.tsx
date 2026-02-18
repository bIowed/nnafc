"use client"
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = async (e: any) => {
    e.preventDefault();
    const email = `${username.toLowerCase()}@nnafc.com`; // Fake email for auth
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: username } }
    });

    if (error) return alert(error.message);

    // Insert into our profiles table
    await supabase.from('profiles').insert([
      { id: data.user?.id, username: username }
    ]);

    alert("Account Created! Login now.");
    router.push('/login');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black">
      <form onSubmit={handleRegister} className="bg-zinc-900 p-8 border-t-4 border-red-600 w-full max-w-sm shadow-2xl">
        <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-6">NNA<span className="text-red-600">FC</span> JOIN</h1>
        <input className="w-full bg-black p-4 mb-4 border border-zinc-800 text-white" placeholder="Username" onChange={e => setUsername(e.target.value)} required />
        <input className="w-full bg-black p-4 mb-6 border border-zinc-800 text-white" type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
        <button className="w-full bg-red-600 p-4 font-black uppercase italic hover:bg-white hover:text-red-600 transition">Create Fighter Profile</button>
      </form>
    </div>
  );
}