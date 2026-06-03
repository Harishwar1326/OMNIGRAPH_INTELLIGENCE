interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  accent?: string;
}

export default function StatCard({ label, value, sub, accent = 'from-omnigraph-600 to-indigo-500' }: StatCardProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-2 bg-gradient-to-r ${accent} bg-clip-text font-display text-3xl font-bold text-transparent`}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
    </div>
  );
}
