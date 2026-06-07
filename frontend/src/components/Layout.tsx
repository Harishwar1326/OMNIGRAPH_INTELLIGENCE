import { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  Network,
  MessageSquare,
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
  Sun,
  Moon,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { logout } from '../services/api';
import { useNavigate } from 'react-router-dom';

const nav = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/upload', label: 'Ingestion', icon: Upload },
  { to: '/graph', label: 'Explorer', icon: Network },
  { to: '/chat', label: 'Intelligence', icon: MessageSquare },
  { to: '/discover', label: 'Discovery', icon: Sparkles },
  { to: '/simulation', label: 'Simulation', icon: TrendingUp },
];

export default function Layout() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (!isDark) {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [isDark]);

  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/auth');
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? 'bg-[#020617] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px] animate-pulse ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-600/5'}`}></div>
        <div className={`absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full blur-[100px] ${isDark ? 'bg-purple-600/10' : 'bg-purple-600/5'}`}></div>
      </div>

      <aside className={`w-72 shrink-0 border-r z-20 flex flex-col transition-all duration-300 ${isDark ? 'border-white/5 bg-slate-900/40 backdrop-blur-3xl' : 'border-slate-200 bg-slate-100/80 backdrop-blur-3xl'}`}>
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
              <Cpu className="text-white" size={24} />
            </div>
            <div>
              <h1 className={`font-display text-xl font-extrabold tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
                OMNIGRAPH
              </h1>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-500">Intelligence v1.0</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          <p className={`px-4 text-[10px] font-black uppercase tracking-widest mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Core Platform</p>
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-x-2'
                    : isDark ? 'text-slate-400 hover:bg-white/5 hover:text-white' : 'text-slate-500 hover:bg-slate-200 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} className={isActive ? 'text-white' : isDark ? 'text-slate-500 group-hover:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-600'} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 space-y-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
              isDark 
                ? 'bg-slate-800/40 border-white/5 text-slate-400 hover:text-white hover:border-white/10' 
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 hover:border-slate-300 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3">
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
              <span className="text-xs font-bold uppercase tracking-widest">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className={`h-2 w-2 rounded-full ${isDark ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}></div>
          </button>

          <div className={`rounded-2xl p-4 border transition-all duration-300 ${isDark ? 'bg-gradient-to-br from-slate-800/40 to-slate-950/40 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 mb-2">
              <Layers size={14} />
              <span>System Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></div>
              <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Knowledge Core Linked</span>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${isDark ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-100 text-indigo-600'} ring-1 ring-white/5`}>
               <UserIcon size={16} />
            </div>
            <div className="min-w-0">
               <p className={`text-[10px] font-black uppercase tracking-widest truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                 {JSON.parse(localStorage.getItem('user') || '{}').name || 'Active User'}
               </p>
               <p className="text-[8px] text-slate-500 uppercase tracking-tighter truncate">
                 {JSON.parse(localStorage.getItem('user') || '{}').email || 'Verified Protocol'}
               </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isDark 
                ? 'text-slate-400 hover:bg-red-500/10 hover:text-red-400' 
                : 'text-slate-500 hover:bg-red-500/5 hover:text-red-600'
            }`}
          >
            <LogOut size={18} />
            <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
          </button>
        </div>
      </aside>
      
      <main className="flex-1 overflow-auto relative z-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto p-10 pb-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
