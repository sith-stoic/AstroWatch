import { Loader2 } from 'lucide-react';

export default function Loader({ label = 'Loading...', size = 20 }) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center gap-3 py-8 text-slate-500">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
        <Loader2 size={size} className="animate-spin" />
      </div>
      <span className="text-sm font-medium text-slate-500">{label}</span>
    </div>
  );
}
