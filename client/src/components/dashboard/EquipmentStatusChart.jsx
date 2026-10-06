// Lightweight horizontal bar breakdown of equipment by status - built with
// plain CSS instead of a charting library to keep the dependency list small.
const STATUS_COLORS = {
  Operational: 'bg-emerald-500',
  Warning: 'bg-amber-500',
  Offline: 'bg-slate-400',
  Maintenance: 'bg-blue-500',
};

export default function EquipmentStatusChart({ data = [] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;

  if (data.length === 0) {
    return <p className="text-sm text-slate-400">No equipment data yet.</p>;
  }

  return (
    <div className="space-y-3">
      {data.map(({ _id: status, count }) => (
        <div key={status}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-slate-600">{status}</span>
            <span className="font-medium text-slate-800">{count}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className={`h-full rounded-full ${STATUS_COLORS[status] || 'bg-slate-400'}`}
              style={{ width: `${(count / total) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
