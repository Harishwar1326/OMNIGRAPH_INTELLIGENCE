import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Network, Info, Layers, Eye } from 'lucide-react';
import GraphCanvas from '../components/GraphCanvas';
import { getGraph } from '../services/api';
import type { GraphData } from '../types';
import { getTypeColor } from '../utils/graphLayout';

const LEGEND = ['Topic', 'Concept', 'Technology', 'Organization', 'Project', 'Person', 'Document'];

export default function GraphPage() {
  const navigate = useNavigate();
  const [graph, setGraph] = useState<GraphData | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  function handleInspect() {
    if (!selected) return;
    navigate('/chat', { state: { initialQuestion: `Explain the strategic significance of ${selected} in our knowledge graph.` } });
  }

  async function load() {
    setLoading(true);
    try {
      const data = await getGraph();
      setGraph(data);
    } catch {
      setGraph({ nodes: [], edges: [] });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto flex flex-col">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
            <Network size={14} />
            <span>Topological Visualization</span>
          </div>
          <h2 className="font-display text-4xl font-black text-white">Relational <span className="gradient-text">Explorer</span></h2>
          <p className="mt-2 text-slate-400 font-medium">
             Analyzed <span className="text-white font-bold">{graph?.nodes.length ?? 0}</span> semantic entities and <span className="text-white font-bold">{graph?.edges.length ?? 0}</span> functional links.
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex flex-wrap gap-x-4 gap-y-2 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
            {LEGEND.map((type) => (
              <span key={type} className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-slate-500">
                <span
                  className="h-2 w-2 rounded-full ring-2 ring-white/10"
                  style={{ background: getTypeColor(type) }}
                />
                {type}
              </span>
            ))}
          </div>
          
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="group flex h-12 items-center gap-3 rounded-2xl bg-slate-800 px-6 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-slate-700 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
            SYNC
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 relative rounded-[2rem] border border-white/5 bg-slate-900/40 backdrop-blur-sm overflow-hidden shadow-2xl">
        <GraphCanvas data={graph} onNodeClick={(_id, label) => setSelected(label)} />
        
        {/* Absolute UI overlay on graph */}
        <div className="absolute top-6 left-6 pointer-events-none">
           <div className="bg-slate-950/80 backdrop-blur border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
              <Eye size={14} className="text-indigo-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Live Viewport</span>
           </div>
        </div>

        {selected && (
          <div className="absolute bottom-6 right-6 w-72 animate-in slide-in-from-right-4 duration-500">
            <div className="glass-card p-5 border-indigo-500/30 bg-indigo-500/10">
              <div className="flex items-center gap-2 text-indigo-400 mb-3 uppercase font-black text-[10px] tracking-widest">
                <Info size={14} /> Entity Detail
              </div>
              <h3 className="text-lg font-bold text-white mb-1 truncate">{selected}</h3>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                Relational context active. Graph traversal highlights nearest semantic neighbors.
              </p>
              <div className="mt-4 flex gap-2">
                 <button 
                  onClick={handleInspect}
                  className="flex-1 py-2 text-[10px] font-black bg-indigo-600 rounded-lg text-white"
                 >
                   INSPECT
                 </button>
                 <button className="px-3 py-2 text-[10px] font-black bg-white/5 rounded-lg text-slate-400" onClick={() => setSelected(null)}>CLOSE</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 px-2">
         <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Layers size={12} /> Neural Mesh L2</span>
            <span>• Neo4j Real-time Sync</span>
         </div>
         <span className="animate-pulse text-indigo-500">Internal Engine Status: Optimized</span>
      </div>
    </div>
  );
}
