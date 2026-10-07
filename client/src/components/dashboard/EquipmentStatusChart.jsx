const STATUS_META = {
  Operational: { bar: 'bg-emerald-500', dot: 'bg-emerald-500', text: 'text-emerald-700' },
  Warning: { bar: 'bg-amber-500', dot: 'bg-amber-500', text: 'text-amber-700' },
  Offline: { bar: 'bg-slate-400', dot: 'bg-slate-400', text: 'text-slate-600' },
  Maintenance: { bar: 'bg-primary-500', dot: 'bg-primary-500', text: 'text-primary-700' },
};

export default function EquipmentStatusChart({ data = [] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;

  if (data.length === 0) {
    return <p className="text-sm text-slate-400">No equipment data yet.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex h-2.5 overflow-hidden rounded-full bg-slate-100">
        {data.map(({ _id: status, count }) => (
          <div
            key={status}
            className={`${STATUS_META[status]?.bar || 'bg-slate-400'} transition-all duration-700`}
            style={{ width: `${(count / total) * 100}%` }}
            title={`${status}: ${count}`}
          />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {data.map(({ _id: status, count }) => {
          const meta = STATUS_META[status] || STATUS_META.Offline;
          return (
            <div key={status} className="rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className={`h-2 w-2 flex-shrink-0 rounded-full ${meta.dot}`} />
                  <span className="truncate text-xs font-medium text-slate-600">{status}</span>
                </div>
                <span className={`text-sm font-bold ${meta.text}`}>{count}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
