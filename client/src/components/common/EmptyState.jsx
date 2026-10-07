import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025]">
        <div className="absolute inset-2 rounded-xl bg-violet-400/[0.045]" />
        <Icon size={21} className="relative text-violet-300/75" />
      </div>
      <div className="max-w-md">
        <p className="font-semibold text-slate-200">{title}</p>
        {message && <p className="mt-1 text-sm leading-6 text-slate-500">{message}</p>}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
