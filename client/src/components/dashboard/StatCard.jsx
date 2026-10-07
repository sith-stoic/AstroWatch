import AnimatedNumber from '../common/AnimatedNumber';

const ACCENTS = {
  blue: {
    chip: 'bg-primary-50 text-primary-600 ring-primary-100',
    glow: 'from-primary-500/10',
  },
  emerald: {
    chip: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
    glow: 'from-emerald-500/10',
  },
  amber: {
    chip: 'bg-amber-50 text-amber-600 ring-amber-100',
    glow: 'from-amber-500/10',
  },
  red: {
    chip: 'bg-red-50 text-red-600 ring-red-100',
    glow: 'from-red-500/10',
  },
  violet: {
    chip: 'bg-violet-50 text-violet-600 ring-violet-100',
    glow: 'from-violet-500/10',
  },
  cyan: {
    chip: 'bg-cyan-50 text-cyan-600 ring-cyan-100',
    glow: 'from-cyan-500/10',
  },
};

export default function StatCard({ icon: Icon, label, value, accent = 'blue', detail }) {
  const styles = ACCENTS[accent] || ACCENTS.blue;

  return (
    <div className="aw-card aw-card-interactive group relative overflow-hidden p-5">
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b ${styles.glow} to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100`} />
      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold uppercase tracking-[0.09em] text-slate-400">{label}</p>
          <p className="mt-2 font-display text-[30px] font-semibold leading-none tracking-[-0.035em] text-slate-950">
            <AnimatedNumber value={value} />
          </p>
          {detail && <p className="mt-2 text-xs text-slate-400">{detail}</p>}
        </div>
        <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl ring-1 ${styles.chip} transition-transform duration-200 group-hover:scale-105`}>
          <Icon size={20} strokeWidth={1.9} />
        </div>
      </div>
    </div>
  );
}
