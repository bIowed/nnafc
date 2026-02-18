"use client"
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Admin() {
  const [users, setUsers] = useState<any[]>([]);
  const [vid, setVid] = useState({ title: '', id: '' });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: profiles } = await supabase.from('profiles').select('*');
    setUsers(profiles || []);
  }

  async function toggleWhitelist(id: string, status: boolean) {
    await supabase.from('profiles').update({ is_whitelisted: !status }).eq('id', id);
    fetchData();
  }

  async function uploadVideo() {
    await supabase.from('videos').insert([{ title: vid.title, youtube_id: vid.id }]);
    alert("Video Uploaded!");
  }

  return (
    <div className="p-10 bg-black min-h-screen text-white font-sans">
      <h1 className="text-6xl font-black italic uppercase mb-12 border-b-8 border-red-600 inline-block">Admin Panel</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        {/* Whitelist Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 uppercase text-zinc-500 tracking-widest">User Whitelist (2 AZN Cash)</h2>
          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className="flex justify-between items-center bg-zinc-900 p-4 border-l-4 border-zinc-700">
                <span className="font-bold">{u.username}</span>
                <button 
                  onClick={() => toggleWhitelist(u.id, u.is_whitelisted)}
                  className={`px-6 py-2 font-black italic uppercase text-xs transition ${u.is_whitelisted ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                >
                  {u.is_whitelisted ? 'Whitelisted' : 'Set Active'}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Video Upload Section */}
        <section className="bg-zinc-900 p-8 border border-zinc-800">
          <h2 className="text-2xl font-bold mb-6 uppercase">Upload Fight Footage</h2>
          <input className="w-full bg-black p-3 mb-4 border border-zinc-700" placeholder="Fight Title" onChange={e => setVid({...vid, title: e.target.value})} />
          <input className="w-full bg-black p-3 mb-4 border border-zinc-700" placeholder="YouTube Video ID" onChange={e => setVid({...vid, id: e.target.value})} />
          <button onClick={uploadVideo} className="w-full bg-white text-black py-4 font-black uppercase italic hover:bg-red-600 hover:text-white transition">Publish Fight</button>
        </section>
      </div>
    </div>
  );
}