import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ open, title = 'Are you sure?', message, confirmLabel = 'Delete', onConfirm, onCancel, loading = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#03050b]/75 px-4 backdrop-blur-[5px]">
      <div className="aw-auth-enter w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0e131f] p-6 shadow-popover">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/15"><AlertTriangle size={20} /></div>
          <div><h3 className="font-display text-base font-semibold text-slate-100">{title}</h3><p className="mt-1.5 text-sm leading-6 text-slate-500">{message}</p></div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5"><button type="button" className="aw-btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button><button type="button" className="aw-btn-danger" onClick={onConfirm} disabled={loading}>{loading ? 'Deleting...' : confirmLabel}</button></div>
      </div>
    </div>
  );
}
