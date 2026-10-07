const STYLE_MAP = {
  Operational: { pill: 'bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20', dot: 'bg-emerald-400' },
  Warning: { pill: 'bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20', dot: 'bg-amber-400' },
  Offline: { pill: 'bg-slate-400/10 text-slate-400 ring-1 ring-slate-400/15', dot: 'bg-slate-500' },
  Maintenance: { pill: 'bg-indigo-400/10 text-indigo-300 ring-1 ring-indigo-400/20', dot: 'bg-indigo-400' },
  Scheduled: { pill: 'bg-violet-400/10 text-violet-300 ring-1 ring-violet-400/20', dot: 'bg-violet-400' },
  'In Progress': { pill: 'bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20', dot: 'bg-amber-400' },
  Completed: { pill: 'bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20', dot: 'bg-emerald-400' },
  Overdue: { pill: 'bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/20', dot: 'bg-rose-400' },
  Cancelled: { pill: 'bg-slate-400/10 text-slate-400 ring-1 ring-slate-400/15', dot: 'bg-slate-500' },
  Low: { pill: 'bg-slate-400/10 text-slate-400 ring-1 ring-slate-400/15', dot: 'bg-slate-500' },
  Medium: { pill: 'bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20', dot: 'bg-cyan-400' },
  High: { pill: 'bg-orange-400/10 text-orange-300 ring-1 ring-orange-400/20', dot: 'bg-orange-400' },
  Critical: { pill: 'bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/20', dot: 'bg-rose-400' },
  Excellent: { pill: 'bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20', dot: 'bg-emerald-400' },
  Good: { pill: 'bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/20', dot: 'bg-cyan-400' },
  Fair: { pill: 'bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20', dot: 'bg-amber-400' },
  Poor: { pill: 'bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/20', dot: 'bg-rose-400' },
};

export default function StatusBadge({ value }) {
  const classes = STYLE_MAP[value] || { pill: 'bg-slate-400/10 text-slate-400 ring-1 ring-slate-400/15', dot: 'bg-slate-500' };
  return <span className={`aw-badge ${classes.pill}`}><span className={`h-1.5 w-1.5 rounded-full ${classes.dot}`} />{value}</span>;
}
