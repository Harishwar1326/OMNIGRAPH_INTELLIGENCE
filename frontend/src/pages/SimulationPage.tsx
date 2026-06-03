import { useState } from 'react';
import { 
  Loader2, 
  Download, 
  BrainCircuit, 
  Search, 
  Zap, 
  ArrowRight,
  Activity
} from 'lucide-react';
import { predictFuture, downloadReport } from '../services/simulationService';
import type { SimulationResult } from '../types';
import GraphCanvas from '../components/GraphCanvas';

export default function SimulationPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  async function handlePredict() {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const data = await predictFuture(query);
      setResult(data);
    } catch (err) {
      console.error('Future prediction failed:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col space-y-10 max-w-[1600px] mx-auto px-4">
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center text-indigo-400">
            <BrainCircuit size={32} className="animate-float" />
          </div>
          <h2 className="font-display text-5xl font-black text-white">FutureScope <span className="gradient-text">AI</span></h2>
        </div>
        <p className="text-slate-400 text-lg font-medium text-center">Predict and visualize hypothetical graph transformations in real-time.</p>
      </header>

      {/* Main Prompt Area */}
      <div className="relative group max-w-4xl mx-auto w-full">
         <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200"></div>
         <div className="relative flex items-center bg-slate-900 rounded-[2.5rem] p-2 border border-white/10 shadow-2xl">
            <div className="pl-6 text-slate-500">
              <Search size={24} />
            </div>
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. What if Team Alpha merges with Team Beta?"
              className="flex-1 bg-transparent px-6 py-4 text-white text-lg outline-none placeholder:text-slate-600 font-medium"
              onKeyDown={(e) => e.key === 'Enter' && handlePredict()}
            />
            <button
               onClick={handlePredict}
               disabled={loading || !query.trim()}
               className="btn-primary rounded-full px-8 py-4 flex items-center gap-2 group/btn"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><Zap size={20} /> <span className="font-black tracking-widest text-xs">PREDICT FUTURE</span></>}
            </button>
         </div>
      </div>

      {!result ? (
        <div className="flex-1 min-h-[400px] flex flex-col items-center justify-center text-slate-700">
            <Activity size={80} className="opacity-5 mb-4" />
            <p className="text-xs font-black uppercase tracking-[0.4em] italic opacity-40">Awaiting Temporal Query</p>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          
          {/* Horizontal Comparison Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[600px]">
              {/* Baseline Graph */}
              <div className="glass-card flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between bg-slate-950/30">
                    <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-slate-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Baseline Network</span>
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    <GraphCanvas data={result.originalGraph} />
                  </div>
              </div>

              {/* Future Graph */}
              <div className="glass-card border-indigo-500/30 bg-indigo-500/5 flex flex-col overflow-hidden">
                  <div className="p-4 border-b border-indigo-500/10 flex items-center justify-between bg-indigo-950/20">
                     <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Predicted Transformation</span>
                     </div>
                     <div className="flex gap-2">
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[8px] font-black border border-emerald-500/20">+ ADDED</span>
                        <span className="bg-red-500/20 text-red-500 px-2 py-0.5 rounded text-[8px] font-black border border-red-500/20">- REMOVED</span>
                     </div>
                  </div>
                  <div className="flex-1 relative">
                    <GraphCanvas data={result.simulatedGraph} />
                  </div>
              </div>
          </div>

          {/* Detailed Intelligence Info at Bottom */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* Left: AI Summary & Intent */}
             <div className="glass-card p-8 space-y-6">
                <div className="flex items-center gap-3 text-indigo-400">
                   <BrainCircuit size={20} />
                   <h4 className="text-sm font-black uppercase tracking-widest text-white">AI Assessment</h4>
                </div>
                <div className="space-y-4">
                   <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 italic text-sm text-slate-300 leading-relaxed font-medium">
                     "{result.summary}"
                   </div>
                   <div className="p-4 rounded-xl bg-indigo-600/5 border border-indigo-500/10">
                      <p className="text-[10px] uppercase font-black tracking-widest text-indigo-400 mb-2">Interpreted Intent</p>
                      <p className="text-xs text-slate-400 font-bold">{result.plan?.action?.replace('_', ' ')}: {result.plan?.source} {result.plan?.target ? `→ ${result.plan.target}` : ''}</p>
                   </div>
                </div>
             </div>

             {/* Middle: Impact & Risks */}
             <div className="glass-card p-8 grid grid-cols-2 gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <Activity size={120} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Impact Score</p>
                   <div className="flex items-baseline gap-2">
                      <span className="text-6xl font-black text-white italic">{result.impactScore}</span>
                      <span className="text-slate-600 font-bold">/100</span>
                   </div>
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Risk Magnitude</p>
                   <span className={`inline-block px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                     result.riskLevel === 'High' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 
                     result.riskLevel === 'Medium' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 
                     'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
                   }`}>
                     {result.riskLevel}
                   </span>
                   <p className="mt-4 text-[10px] text-slate-500 font-bold">{result.risks.length} Critical Risks Flagged</p>
                </div>
             </div>

             {/* Right: Recommendations & Export */}
             <div className="glass-card p-8 flex flex-col justify-between">
                <div>
                   <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
                      <Zap className="text-amber-400" size={18} /> Strategic Actions
                   </h4>
                   <div className="space-y-3">
                      {result.aiRecommendations.map((rec, i) => (
                        <div key={i} className="flex gap-3 text-xs text-slate-400 group">
                           <ArrowRight size={14} className="text-indigo-500 shrink-0 group-hover:translate-x-1 transition-transform" />
                           <span className="font-medium">{rec}</span>
                        </div>
                      ))}
                   </div>
                </div>
                <button 
                  onClick={() => downloadReport(result)}
                  className="mt-8 w-full py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
                >
                  <Download size={14} className="inline-block mr-2" /> Download Predictive Dataset
                </button>
             </div>

          </div>
        </div>
      )}
    </div>
  );
}
