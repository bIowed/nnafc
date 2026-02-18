"use client"
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'; // RELATIVE PATH
import { useRouter } from 'next/navigation';
import { ShieldAlert, Users, Video, Settings, Type, CheckCircle, XCircle, Trash2 } from 'lucide-react';

export default function AdminHQ() {
  const [users, setUsers] = useState<any[]>([]);
  const [fights, setFights] = useState<any[]>([]);
  const [settings, setSettings] = useState({ title: '', trailer: '' });
  const [vid, setVid] = useState({ t: '', id: '' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. SECURITY: KICK OUT NON-ADMINS
  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push('/login');
      
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      
      if (!profile?.is_admin) {
        router.push('/');
      } else {
        setIsAdmin(true);
        loadData();
      }
    }
    checkAdmin();
  }, [router]);

  // 2. DATA LOADING
  async function loadData() {
    setLoading(true);
    const { data: p } = await supabase.from('profiles').select('*').order('username');
    const { data: s } = await supabase.from('site_settings').select('*');
    const { data: v } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
    
    setUsers(p || []);
    setFights(v || []);
    setSettings({
      title: s?.find(x => x.id === 'hero_title')?.value || '',
      trailer: s?.find(x => x.id === 'trailer_id')?.value || ''
    });
    setLoading(false);
  }

  // 3. THE TOGGLE WHITELIST FUNCTION (The one you were missing)
  const toggleWhitelist = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_whitelisted: !currentStatus })
      .eq('id', userId);
    
    if (error) {
      alert("ERROR: " + error.message);
    } else {
      loadData(); // Refresh list instantly
    }
  };

  // 4. GLOBAL SETTINGS (TITLE & TRAILER)
  const saveGlobalSettings = async () => {
    await supabase.from('site_settings').upsert({ id: 'hero_title', value: settings.title });
    await supabase.from('site_settings').upsert({ id: 'trailer_id', value: settings.trailer });
    alert("HQ: SYSTEM UPDATED");
    loadData();
  };

  // 5. DELETE FIGHT
  const deleteFight = async (id: string) => {
    if (confirm("Delete this fight permanently?")) {
      await supabase.from('videos').delete().eq('id', id);
      loadData();
    }
  };

  if (!isAdmin) return <div className="h-screen bg-black flex items-center justify-center font-black italic text-[#D20A0A] uppercase animate-pulse">Authenticating Command...</div>;

  return (
    <div className="p-4 md:p-12 bg-black min-h-screen text-white font-sans">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 border-b-8 border-[#D20A0A] pb-6">
        <div className="flex items-center gap-4">
          <ShieldAlert size={60} className="text-[#D20A0A]" />
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none text-white">NNAFC <span className="text-[#D20A0A]">HQ</span></h1>
        </div>
        <p className="text-zinc-500 font-black italic text-xl uppercase tracking-widest underline decoration-[#D20A0A]">Management Portal</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* SITE DESIGN CONTROL */}
        <div className="bg-zinc-950 border border-zinc-900 p-8 shadow-[0_0_40px_rgba(210,10,10,0.1)]">
          <div className="flex items-center gap-2 mb-8 text-[#D20A0A] font-black italic uppercase text-2xl">
            <Settings size={24} /> General Config
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-[10px] text-zinc-500 font-black uppercase mb-2 block">Hero Event Title</label>
              <input 
                value={settings.title} 
                onChange={e => setSettings({...settings, title: e.target.value})} 
                className="w-full bg-black p-4 border border-zinc-800 font-bold focus:border-[#D20A0A] outline-none text-white" 
              />
            </div>
            
            <div>
              <label className="text-[10px] text-zinc-500 font-black uppercase mb-2 block">Background Trailer (Youtube ID)</label>
              <input 
                value={settings.trailer} 
                onChange={e => setSettings({...settings, trailer: e.target.value})} 
                className="w-full bg-black p-4 border border-zinc-800 font-bold focus:border-[#D20A0A] outline-none text-white font-mono" 
              />
            </div>
            
            <button 
              onClick={saveGlobalSettings} 
              className="w-full bg-white text-black py-5 font-black italic uppercase text-xl nna-btn hover:bg-[#D20A0A] hover:text-white transition-all shadow-[6px_6px_0px_#D20A0A]"
            >
              Update Production
            </button>
          </div>
        </div>

        {/* CONTENT MANAGER */}
        <div className="bg-zinc-950 border border-zinc-900 p-8">
          <div className="flex items-center gap-2 mb-8 text-[#D20A0A] font-black italic uppercase text-2xl">
            <Video size={24} /> Broadcast Fight
          </div>
          
          <input 
            placeholder="FIGHT TITLE (e.g. Kamal vs Jamal)" 
            onChange={e => setVid({...vid, t: e.target.value})} 
            className="w-full bg-black p-4 mb-3 border border-zinc-800 text-white font-bold" 
          />
          <input 
            placeholder="YOUTUBE VIDEO ID" 
            onChange={e => setVid({...vid, id: e.target.value})} 
            className="w-full bg-black p-4 mb-6 border border-zinc-800 text-white font-mono" 
          />
          
          <button 
            onClick={async () => {
               if(!vid.t || !vid.id) return alert("Fill all fields");
               await supabase.from('videos').insert([{ title: vid.t, youtube_id: vid.id }]);
               alert("BROADCAST PUSHED");
               loadData();
            }} 
            className="w-full bg-[#D20A0A] text-white py-5 font-black italic uppercase text-xl nna-btn hover:bg-white hover:text-black transition-all"
          >
            Push to Archives
          </button>

          <div className="mt-10 space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scroll">
            <p className="text-[10px] font-black text-zinc-600 mb-2 uppercase">Current Archives</p>
            {fights.map(f => (
              <div key={f.id} className="flex justify-between items-center bg-black p-3 border border-zinc-900">
                <span className="text-xs font-bold truncate pr-4">{f.title}</span>
                <button onClick={() => deleteFight(f.id)} className="text-zinc-600 hover:text-red-600 transition">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ROSTER WHITELIST (CASH MANAGER) */}
        <div className="bg-zinc-950 border border-zinc-900 p-8">
          <div className="flex items-center gap-2 mb-8 text-[#D20A0A] font-black italic uppercase text-2xl">
            <Users size={24} /> Whitelist (2 AZN Cash)
          </div>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scroll">
            {users.map(u => (
              <div key={u.id} className={`flex justify-between items-center p-4 border border-zinc-900 transition-all ${u.is_whitelisted ? 'bg-zinc-900/50' : 'bg-black'}`}>
                <div>
                    <p className="font-black text-sm uppercase italic text-white leading-none">{u.username}</p>
                    <p className={`text-[8px] font-bold mt-1 ${u.is_whitelisted ? 'text-green-500' : 'text-zinc-700'}`}>
                      {u.is_whitelisted ? 'NNA+ MEMBER' : 'LOCKED ACCESS'}
                    </p>
                </div>
                <button 
                  onClick={() => toggleWhitelist(u.id, u.is_whitelisted)} 
                  className={`px-6 py-2 text-[10px] font-black italic nna-btn transition-all duration-300 ${u.is_whitelisted ? 'bg-green-600 text-white hover:bg-red-600' : 'bg-[#D20A0A] text-white hover:bg-green-600'}`}
                >
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