import { useEffect, useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { discover } from '../services/api';
import type { DiscoverySuggestion } from '../types';

export default function DiscoverPage() {
  const [suggestions, setSuggestions] = useState<DiscoverySuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { suggestions: data } = await discover();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold">Hidden Relationship Discovery</h2>
          <p className="mt-1 text-slate-400">
            Rule-based detection of shared projects, organizations, and technologies.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Scan
        </button>
      </div>

      {suggestions.length === 0 && !loading && (
        <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center text-slate-500">
          No hidden relationships found yet. Upload more documents to enrich the graph.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/50 p-6"
          >
            <div className="flex items-start gap-3">
              <Sparkles className="shrink-0 text-amber-400" size={22} />
              <div>
                <p className="font-medium text-amber-200/90">
                  {s.message || 'Potential hidden relationship detected.'}
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {s.entityA} ↔ {s.entityB}
                </p>
                <p className="mt-2 text-sm text-slate-400">{s.reason}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                    {s.type.replace(/_/g, ' ')}
                  </span>
                  <span className="rounded-full bg-omnigraph-600/30 px-3 py-1 text-xs text-omnigraph-300">
                    {(s.confidence * 100).toFixed(0)}% confidence
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
