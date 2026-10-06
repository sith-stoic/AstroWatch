import { Inbox } from 'lucide-react';

// Shown in place of a table/list when there is no data (or no results for a filter).
export default function EmptyState({ icon: Icon = Inbox, title = 'Nothing here yet', message, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Icon size={22} className="text-slate-400" />
      </div>
      <div>
        <p className="font-medium text-slate-700">{title}</p>
        {message && <p className="mt-1 text-sm text-slate-500">{message}</p>}
      </div>
      {action}
    </div>
  );
}
