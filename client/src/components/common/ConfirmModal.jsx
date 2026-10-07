import { AlertTriangle } from 'lucide-react';

export default function ConfirmModal({ open, title = 'Are you sure?', message, confirmLabel = 'Delete', onConfirm, onCancel, loading = false }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/45 px-4 backdrop-blur-[3px]">
      <div className="aw-auth-enter w-full max-w-sm rounded-2xl border border-white bg-white p-6 shadow-popover">
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 ring-1 ring-red-100"><AlertTriangle size={20} /></div>
          <div><h3 className="font-display text-base font-semibold text-slate-900">{title}</h3><p className="mt-1.5 text-sm leading-6 text-slate-500">{message}</p></div>
        </div>
        <div className="mt-6 flex justify-end gap-2.5"><button type="button" className="aw-btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button><button type="button" className="aw-btn-danger" onClick={onConfirm} disabled={loading}>{loading ? 'Deleting...' : confirmLabel}</button></div>
      </div>
    </div>
  );
}
