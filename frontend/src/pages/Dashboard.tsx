import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Brain, 
  Network, 
  FileText, 
  Trash2, 
  Calendar,
  Sparkles,
  Zap,
  Activity,
  Box,
  Layers,
  TrendingUp
} from 'lucide-react';
import { getStats, getDocuments, deleteDocument } from '../services/api';
import type { Stats } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [documents, setDocuments] = useState<{ filename: string; uploadedAt: string }[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [s, docs] = await Promise.all([getStats(), getDocuments()]);
      setStats(s);
      setDocuments(docs);
      setError('');
    } catch (err) {
      setError('Connection interrupted. Ensure Knowledge Engine is active.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(filename: string) {
    if (!confirm(`Permanently remove ${filename} and its graph nodes?`)) return;
    try {
      await deleteDocument(filename);
      await loadData();
    } catch {
      alert('Action failed');
    }
  }

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <header className="relative py-4">
        <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
          <Activity size={14} className="animate-pulse" />
          <span>Intelligence Hub</span>
        </div>
        <h2 className="font-display text-5xl font-black tracking-tight text-white">
          Network <span className="gradient-text">Overview</span>
        </h2>
        <p className="mt-4 text-lg text-slate-400 max-w-2xl leading-relaxed">
          Operational telemetry and distilled knowledge from your connected enterprise documents.
        </p>
      </header>

      {error && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-center gap-3 text-amber-200 text-sm backdrop-blur-md">
          <Zap size={18} />
          {error}
        </div>
      )}

      {/* Metrics Section */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Nodes', value: stats?.nodeCount ?? 0, icon: Box, color: 'from-blue-500 to-cyan-500' },
          { label: 'Edges', value: stats?.relationshipCount ?? 0, icon: Network, color: 'from-emerald-500 to-teal-500' },
          { label: 'Sources', value: stats?.documentCount ?? 0, icon: FileText, color: 'from-orange-500 to-amber-500' },
          { label: 'Groups', value: Object.keys(stats?.entityTypes ?? {}).length, icon: Layers, color: 'from-purple-500 to-pink-500' },
        ].map((m, i) => (
          <div key={i} className="glass-card p-6 group">
            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${m.color} text-white shadow-lg`}>
              <m.icon size={24} />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{m.label}</p>
            <h3 className="mt-1 text-3xl font-black text-white italic">{loading ? '...' : m.value}</h3>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Actions */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="text-amber-400" size={20} />
              Strategic Modules
            </h3>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                to: '/upload',
                icon: FileText,
                title: 'Data Ingestion',
                desc: 'Upload PDFs to construct the graph.',
                color: 'group-hover:text-amber-400',
                bg: 'bg-amber-400/10'
              },
              {
                to: '/graph',
                icon: Network,
                title: 'Graph Explorer',
                desc: 'Map hidden entity connections.',
                color: 'group-hover:text-blue-400',
                bg: 'bg-blue-400/10'
              },
              {
                to: '/chat',
                icon: Brain,
                title: 'OmniAI Chat',
                desc: 'Neural-grounded Q&A engine.',
                color: 'group-hover:text-purple-400',
                bg: 'bg-purple-400/10'
              },
              {
                to: '/simulation',
                icon: TrendingUp,
                title: 'Scenario Engine',
                desc: 'Simulate structural change outcomes.',
                color: 'group-hover:text-emerald-400',
                bg: 'bg-emerald-400/10'
              },
            ].map(({ to, icon: Icon, title, desc, color, bg }) => (
              <Link
                key={to}
                to={to}
                className="group glass-card p-8 flex flex-col justify-between"
              >
                <div>
                   <div className={`h-12 w-12 mb-6 flex items-center justify-center rounded-2xl ${bg} transition-transform group-hover:scale-110 duration-500`}>
                      <Icon className="text-white" size={24} />
                   </div>
                   <h4 className={`text-xl font-bold text-white mb-2 ${color} transition-colors`}>{title}</h4>
                   <p className="text-sm text-slate-400 leading-relaxed font-medium">{desc}</p>
                </div>
                <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-400">
                  Launch <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Managed Knowledge */}
        <div className="space-y-8">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Box className="text-indigo-400" size={20} />
            Knowledge Base
          </h3>
          
          <div className="glass-card p-4 flex flex-col h-[560px]">
            <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
              {documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-600 space-y-4">
                  <FileText size={48} className="opacity-20" />
                  <p className="text-xs uppercase font-black tracking-widest italic">Inventory Empty</p>
                </div>
              ) : (
                documents.map((doc, i) => (
                  <div key={i} className="group relative rounded-2xl bg-white/[0.03] p-4 border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-800 text-slate-400 ring-1 ring-white/10">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-white truncate" title={doc.filename}>{doc.filename}</p>
                        <p className="text-[10px] uppercase font-black tracking-tighter text-slate-500 flex items-center gap-1.5 mt-1">
                          <Calendar size={12} /> {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(doc.filename)}
                      className="absolute top-2 right-2 p-2 text-slate-600 hover:text-red-400 transition-colors"
                      title="Purge Document"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5">
                <Link to="/upload" className="block w-full text-center py-3 rounded-xl bg-indigo-600/10 text-indigo-400 text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-lg active:scale-[0.98]">
                  Manage Ingestion
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
