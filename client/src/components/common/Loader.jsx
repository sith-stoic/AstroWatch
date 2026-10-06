import { Loader2 } from 'lucide-react';

// Small reusable spinner used for loading states across the app.
export default function Loader({ label = 'Loading...', size = 20 }) {
  return (
    <div className="flex items-center justify-center gap-2 py-8 text-slate-500">
      <Loader2 size={size} className="animate-spin text-primary-600" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
