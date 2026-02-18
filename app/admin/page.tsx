"use client"
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Video, Users, Settings, Trash2, LayoutDashboard } from 'lucide-react';

export default function AdminHQ() {
  const [users, setUsers] = useState<any[]>([]);
  const [fights, setFights] = useState<any[]>([]);
  const [settings, setSettings] = useState({ title: '', trailer: '' });
  const [vid, setVid] = useState({ t: '', id: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (!profile?.is_admin) router.push('/');
      else { setIsAdmin(true); loadData(); }
    }
    checkAdmin();
  }, [router]);

  async function loadData() {
    const { data: p } = await supabase.from('profiles').select('*').order('username');
    const { data: v } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    const { data: s } = await supabase.from('site_settings').select('*');
    setUsers(p || []);
    setFights(v || []);
    setSettings({
      title: s?.find(x => x.id === 'hero_title')?.value || '',
      trailer: s?.find(x => x.id === 'trailer_id')?.value || ''
    });
  }

  // --- THE BROADCAST FUNCTION ---
  const postFight = async () => {
    if (!vid.t || !vid.id) return alert("Enter Title and Youtube ID");
    const { error } = await supabase.from('videos').insert([{ title: vid.t, youtube_id: vid.id, is_premium: true }]);
    if (error) {
      alert("ERROR: " + error.message);
    } else {
      alert("FIGHT BROADCASTED TO ARCHIVE");
      setVid({ t: '', id: '' });
      loadData(); // Refresh local list
    }
  };

  const toggleWhitelist = async (id: string, current: boolean) => {
    await supabase.from('profiles').update({ is_whitelisted: !current }).eq('id', id);
    loadData();
  };

  const saveSettings = async () => {
    await supabase.from('site_settings').upsert({ id: 'hero_title', value: settings.title });
    await supabase.from('site_settings').upsert({ id: 'trailer_id', value: settings.trailer });
    alert("SITE CONFIG UPDATED");
  };

  const deleteFight = async (id: string) => {
    if (confirm("Delete this fight?")) {
      await supabase.from('videos').delete().eq('id', id);
      loadData();
    }
  };

  if (!isAdmin) return <div className="h-screen bg-black flex items-center justify-center font-black text-[#D20A0A] italic uppercase">Authenticating...</div>;

  return (
    <div className="p-4 md:p-12 bg-black min-h-screen text-white font-sans uppercase">
      <div className="flex items-center gap-4 mb-12 border-b-8 border-[#D20A0A] pb-6">
        <ShieldAlert size={50} className="text-[#D20A0A]" />
        <h1 className="text-6xl font-black italic tracking-tighter">NNAFC <span className="text-[#D20A0A]">HQ</span></h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* SETTINGS */}
        <div className="bg-zinc-950 border border-zinc-900 p-8 shadow-2xl">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 italic underline decoration-[#D20A0A]"><Settings size={20}/> Site Display</h2>
          <label className="text-[10px] text-zinc-600 font-black">Hero Title</label>
          <input value={settings.title} onChange={e => setSettings({...settings, title: e.target.value})} className="w-full bg-black p-4 mb-4 border border-zinc-800 font-bold" />
          <label className="text-[10px] text-zinc-600 font-black">Trailer YouTube ID</label>
          <input value={settings.trailer} onChange={e => setSettings({...settings, trailer: e.target.value})} className="w-full bg-black p-4 mb-8 border border-zinc-800 font-mono" />
          <button onClick={saveSettings} className="w-full bg-white text-black py-4 font-black italic nna-btn hover:bg-[#D20A0A] hover:text-white transition-all">Save Config</button>
        </div>

        {/* BROADCAST FIGHT */}
        <div className="bg-zinc-950 border border-zinc-900 p-8">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 italic underline decoration-[#D20A0A]"><Video size={20}/> Broadcast Fight</h2>
          <input value={vid.t} placeholder="FIGHT NAME" onChange={e => setVid({...vid, t: e.target.value})} className="w-full bg-black p-4 mb-2 border border-zinc-800" />
          <input value={vid.id} placeholder="YOUTUBE ID" onChange={e => setVid({...vid, id: e.target.value})} className="w-full bg-black p-4 mb-6 border border-zinc-800 font-mono" />
          <button onClick={postFight} className="w-full bg-[#D20A0A] text-white py-4 font-black italic nna-btn">Broadcast Now</button>
          
          <div className="mt-8 space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scroll">
            <p className="text-[10px] font-black text-zinc-700">Live Archives</p>
            {fights.map(f => (
              <div key={f.id} className="flex justify-between items-center bg-black p-3 border border-zinc-900 group">
                <span className="text-xs font-bold truncate pr-2 italic">{f.title}</span>
                <button onClick={() => deleteFight(f.id)} className="text-zinc-700 hover:text-red-600 transition"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* ROSTER WHITELIST */}
        <div className="bg-zinc-950 border border-zinc-900 p-8">
          <h2 className="text-xl font-black mb-6 flex items-center gap-2 italic underline decoration-[#D20A0A]"><Users size={20}/> Whitelist (2 AZN)</h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scroll">
            {users.map(u => (
              <div key={u.id} className="flex justify-between items-center bg-black p-4 border border-zinc-900 group">
                <div>
                    <p className="font-black text-xs italic leading-none">{u.username}</p>
                    <p className={`text-[8px] font-bold mt-1 ${u.is_whitelisted ? 'text-green-500' : 'text-zinc-700'}`}>{u.is_whitelisted ? 'ACTIVE' : 'LOCKED'}</p>
                </div>
                <button onClick={() => toggleWhitelist(u.id, u.is_whitelisted)} className={`px-4 py-2 text-[10px] font-black italic nna-btn ${u.is_whitelisted ? 'bg-green-600' : 'bg-[#D20A0A]'}`}>
                  {u.is_whitelisted ? 'REVOKE' : 'WHITELIST'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}