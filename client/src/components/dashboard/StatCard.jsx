// Small stat card used across the dashboard grid.
// `accent` picks a subtle background tint for the icon chip only - keeps the
// grid calm while still giving each card a bit of visual identity.
const ACCENTS = {
  blue: 'bg-primary-50 text-primary-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  violet: 'bg-violet-50 text-violet-600',
  cyan: 'bg-cyan-50 text-cyan-600',
};

export default function StatCard({ icon: Icon, label, value, accent = 'blue' }) {
  return (
    <div className="aw-card flex items-center gap-4 p-5">
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg ${ACCENTS[accent]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-slate-500">{label}</p>
        <p className="font-display text-2xl font-semibold text-slate-900">{value}</p>
      </div>
    </div>
  );
}
