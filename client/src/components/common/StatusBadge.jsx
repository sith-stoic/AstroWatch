const STYLE_MAP = {
  Operational: { pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-500' },
  Warning: { pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', dot: 'bg-amber-500' },
  Offline: { pill: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200', dot: 'bg-slate-400' },
  Maintenance: { pill: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200', dot: 'bg-blue-500' },
  Scheduled: { pill: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200', dot: 'bg-blue-500' },
  'In Progress': { pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', dot: 'bg-amber-500' },
  Completed: { pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-500' },
  Overdue: { pill: 'bg-red-50 text-red-700 ring-1 ring-red-200', dot: 'bg-red-500' },
  Cancelled: { pill: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200', dot: 'bg-slate-400' },
  Low: { pill: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200', dot: 'bg-slate-400' },
  Medium: { pill: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200', dot: 'bg-sky-500' },
  High: { pill: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200', dot: 'bg-orange-500' },
  Critical: { pill: 'bg-red-50 text-red-700 ring-1 ring-red-200', dot: 'bg-red-500' },
  Excellent: { pill: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200', dot: 'bg-emerald-500' },
  Good: { pill: 'bg-sky-50 text-sky-700 ring-1 ring-sky-200', dot: 'bg-sky-500' },
  Fair: { pill: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200', dot: 'bg-amber-500' },
  Poor: { pill: 'bg-red-50 text-red-700 ring-1 ring-red-200', dot: 'bg-red-500' },
};

export default function StatusBadge({ value }) {
  const classes = STYLE_MAP[value] || { pill: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200', dot: 'bg-slate-400' };
  return <span className={`aw-badge ${classes.pill}`}><span className={`h-1.5 w-1.5 rounded-full ${classes.dot}`} />{value}</span>;
}
