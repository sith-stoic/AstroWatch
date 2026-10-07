import { Loader2 } from 'lucide-react';

export default function Loader({ label = 'Loading...', size = 20 }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 py-8 text-slate-500">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-400/10 text-violet-300 ring-1 ring-violet-400/15 shadow-[0_0_30px_rgba(139,92,246,.08)]">
        <Loader2 size={size} className="animate-spin" />
      </div>
      <span className="text-sm font-semibold text-slate-500">{label}</span>
    </div>
  );
}
