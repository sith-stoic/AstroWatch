import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-100">
        <div className="absolute inset-2 rounded-xl bg-white shadow-sm" />
        <Icon size={21} className="relative text-slate-400" />
      </div>
      <div className="max-w-md">
        <p className="font-semibold text-slate-800">{title}</p>
        {message && <p className="mt-1 text-sm leading-6 text-slate-500">{message}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
