import { CheckCircle2, FileText, Database, Link as LinkIcon } from 'lucide-react';
import type { UploadResult } from '../types';

interface ResultPreviewProps {
  result: UploadResult;
}

export default function ResultPreview({ result }: ResultPreviewProps) {
  return (
    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-8 animate-in zoom-in-95 duration-500">
      <div className="flex items-center gap-3 text-emerald-400 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold">Extraction Successful</h3>
          <p className="text-sm text-emerald-500/70">Knowledge nodes and relationships have been generated.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl bg-slate-900/50 p-6 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <Database size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Entities</span>
          </div>
          <p className="text-3xl font-display font-bold text-white">{result.stats.entityCount}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.entities.slice(0, 5).map((e, i) => (
              <span key={i} className="px-2 py-1 rounded-md bg-slate-800 text-[10px] text-slate-300">
                {e.name}
              </span>
            ))}
            {result.entities.length > 5 && (
              <span className="text-[10px] text-slate-500">+{result.entities.length - 5} more</span>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/50 p-6 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <LinkIcon size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">Relationships</span>
          </div>
          <p className="text-3xl font-display font-bold text-white">{result.stats.relationshipCount}</p>
          <div className="mt-4 space-y-1">
            {result.relationships.slice(0, 3).map((r, i) => (
              <p key={i} className="text-[10px] text-slate-400 truncate">
                {r.source} → {r.relationship} → {r.target}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900/50 p-6 border border-slate-800">
          <div className="flex items-center gap-2 text-slate-400 mb-2">
            <FileText size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">File Metadata</span>
          </div>
          <p className="text-white font-medium truncate">{result.filename || 'Direct Text'}</p>
          <p className="mt-1 text-xs text-slate-500">
            Processed {Math.round(result.textLength / 1024)} KB of content
          </p>
        </div>
      </div>
    </div>
  );
}
