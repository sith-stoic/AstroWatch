import AnimatedNumber from '../common/AnimatedNumber';

const ACCENTS = {
  blue: {
    icon: 'bg-indigo-400/10 text-indigo-300 ring-indigo-400/15',
    glow: 'rgba(99,102,241,.17)',
    line: 'from-indigo-400 via-violet-400 to-transparent',
  },
  emerald: {
    icon: 'bg-emerald-400/10 text-emerald-300 ring-emerald-400/15',
    glow: 'rgba(52,211,153,.14)',
    line: 'from-emerald-400 via-emerald-300 to-transparent',
  },
  amber: {
    icon: 'bg-amber-400/10 text-amber-300 ring-amber-400/15',
    glow: 'rgba(251,191,36,.13)',
    line: 'from-amber-400 via-orange-300 to-transparent',
  },
  red: {
    icon: 'bg-rose-400/10 text-rose-300 ring-rose-400/15',
    glow: 'rgba(251,113,133,.13)',
    line: 'from-rose-400 via-red-300 to-transparent',
  },
  violet: {
    icon: 'bg-violet-400/10 text-violet-300 ring-violet-400/15',
    glow: 'rgba(167,139,250,.17)',
    line: 'from-violet-400 via-fuchsia-300 to-transparent',
  },
  cyan: {
    icon: 'bg-cyan-400/10 text-cyan-300 ring-cyan-400/15',
    glow: 'rgba(34,211,238,.14)',
    line: 'from-cyan-400 via-sky-300 to-transparent',
  },
};

export default function StatCard({ icon: Icon, label, value, accent = 'blue', detail }) {
  const styles = ACCENTS[accent] || ACCENTS.blue;

  return (
    <div className="aw-card aw-card-interactive group relative overflow-hidden p-5">
      <div className={`pointer-events-none absolute left-0 top-0 h-px w-28 bg-gradient-to-r ${styles.line} opacity-80`} />
      <div
        className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full blur-3xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: styles.glow, opacity: 0.58 }}
      />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[9px] font-bold uppercase tracking-[0.17em] text-slate-500">{label}</p>
          <p className="mt-3 font-display text-[31px] font-semibold leading-none tracking-[-0.05em] text-slate-50">
            <AnimatedNumber value={value} />
          </p>
          {detail && <p className="mt-2.5 text-[11px] font-medium text-slate-600">{detail}</p>}
        </div>
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ring-1 ${styles.icon} transition-transform duration-200 group-hover:scale-105`}>
          <Icon size={19} strokeWidth={1.9} />
        </div>
      </div>
    </div>
  );
}
