import { useState, useEffect } from 'react';
import { Upload, FileText, Loader2, Trash2, Zap, Sparkles, Database } from 'lucide-react';
import { uploadPdf, extractText, getDocuments, deleteDocument } from '../services/api';
import type { UploadResult } from '../types';
import ResultPreview from '../components/ResultPreview';

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState('');
  const [documents, setDocuments] = useState<{ filename: string; uploadedAt: string }[]>([]);

  useEffect(() => {
    loadDocs();
  }, []);

  async function loadDocs() {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await uploadPdf(file);
      setResult(res);
      loadDocs();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ingestion failed. Check file format.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDemo() {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const demoText = `The OMNIGRAPH project is an Enterprise Intelligence platform developed by the AI Strategy team. 
      It uses Neo4j for graph storage and LLM for entity extraction. Bob Smith is the Lead Architect.`;
      const res = await extractText(demoText);
      setResult(res);
      loadDocs();
    } catch (err: any) {
      setError('Demo engine failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(filename: string) {
    if (!confirm(`Permanently remove ${filename}?`)) return;
    try {
      await deleteDocument(filename);
      loadDocs();
      if (result?.filename === filename) setResult(null);
    } catch {
      alert('Action failed');
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12">
      <header>
        <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-[0.3em] text-[10px] mb-2">
          <Database size={14} />
          <span>Knowledge Ingestion</span>
        </div>
        <h2 className="font-display text-4xl font-black text-white">Data <span className="gradient-text">Capture</span></h2>
        <p className="mt-4 text-slate-400 text-lg max-w-2xl leading-relaxed">
          Propagate your unstructured data (PDF, TXT, CSV) into the OMNIGRAPH neural knowledge network.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="glass-card p-12 text-center relative overflow-hidden group">
            {/* Animated background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="relative z-10">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-400 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <Upload size={36} />
              </div>
              <h3 className="mt-8 text-xl font-bold text-white">Drop your intelligence here</h3>
              <p className="mt-2 text-slate-500 text-sm">Deployment support for PDF, CSV, and Raw Text</p>
              
              <label className="mt-10 block mx-auto w-fit cursor-pointer rounded-2xl bg-indigo-600 px-10 py-4 font-bold text-white shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all active:scale-95">
                {loading ? (
                  <span className="flex items-center gap-3">
                    <Loader2 className="animate-spin" size={20} /> ANALYZING...
                  </span>
                ) : (
                  'SELECT FILE'
                )}
                <input type="file" accept=".pdf,.txt,.csv" className="hidden" onChange={handleFile} disabled={loading} />
              </label>
              
              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-white/5"></div>
                <button
                  onClick={handleDemo}
                  disabled={loading}
                  className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-indigo-400 p-2 transition-colors flex items-center gap-2"
                >
                  <Zap size={14} /> Run Neural Demo
                </button>
                <div className="h-px w-12 bg-white/5"></div>
              </div>
            </div>

            {error && (
              <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-200 backdrop-blur-sm animate-in fade-in zoom-in-95">
                {error}
              </div>
            )}
          </div>

          {result && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <ResultPreview result={result} />
            </div>
          )}
        </div>

        <div className="space-y-6">
           <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2 px-2">
             <FileText size={16} /> Repository
           </h3>
           <div className="space-y-3">
            {documents.length === 0 ? (
              <div className="glass-card p-8 text-center text-slate-600">
                <p className="text-[10px] uppercase font-bold tracking-widest italic">No Records</p>
              </div>
            ) : (
              documents.map((doc, i) => (
                <div key={i} className="glass-card p-4 flex items-center justify-between group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-white/5 text-slate-400 group-hover:text-indigo-400 transition-colors">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate" title={doc.filename}>{doc.filename}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(doc.filename)}
                    className="p-2 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
           </div>
           <div className="p-4 rounded-2xl bg-indigo-600/5 border border-indigo-500/10">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <Sparkles size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Expert Tip</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                For best results, upload technical documentation or project specs. OMNIGRAPH works best with structured conceptual data.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
