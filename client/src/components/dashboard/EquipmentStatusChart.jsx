const STATUS_META = {
  Operational: { bar: 'bg-emerald-400', dot: 'bg-emerald-400', text: 'text-emerald-300' },
  Warning: { bar: 'bg-amber-400', dot: 'bg-amber-400', text: 'text-amber-300' },
  Offline: { bar: 'bg-slate-500', dot: 'bg-slate-500', text: 'text-slate-400' },
  Maintenance: { bar: 'bg-indigo-400', dot: 'bg-indigo-400', text: 'text-indigo-300' },
};

export default function EquipmentStatusChart({ data = [] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;

  if (data.length === 0) {
    return <p className="text-sm text-slate-500">No equipment data yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-white/[0.045] ring-1 ring-inset ring-white/[0.04]">
        {data.map(({ _id: status, count }) => (
          <div
            key={status}
            className={`${STATUS_META[status]?.bar || 'bg-slate-500'} transition-all duration-700`}
            style={{ width: `${(count / total) * 100}%` }}
            title={`${status}: ${count}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {data.map(({ _id: status, count }) => {
          const meta = STATUS_META[status] || STATUS_META.Offline;
          return (
            <div key={status} className="rounded-xl border border-white/[0.055] bg-white/[0.025] px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`h-2 w-2 flex-shrink-0 rounded-full ${meta.dot}`} />
                  <span className="truncate text-xs font-medium text-slate-400">{status}</span>
                </div>
                <span className={`font-display text-sm font-semibold ${meta.text}`}>{count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
