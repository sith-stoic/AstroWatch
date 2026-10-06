// Maps a status/priority/condition string to a Tailwind color pairing.
// Centralizing this means every table/card gets consistent badge colors.
const STYLE_MAP = {
  // Equipment status
  Operational: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Warning: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Offline: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  Maintenance: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',

  // Maintenance / Observation status
  Scheduled: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  'In Progress': 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Completed: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Overdue: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  Cancelled: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',

  // Priority
  Low: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
  Medium: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  High: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  Critical: 'bg-red-50 text-red-700 ring-1 ring-red-200',

  // Condition
  Excellent: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Good: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200',
  Fair: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Poor: 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

export default function StatusBadge({ value }) {
  const classes = STYLE_MAP[value] || 'bg-slate-100 text-slate-600 ring-1 ring-slate-200';
  return <span className={`aw-badge ${classes}`}>{value}</span>;
}
