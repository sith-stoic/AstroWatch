import { Activity, CloudSun, Radio, Wrench } from 'lucide-react';
import BrandMark from './BrandMark';

const FEATURES = [
  { icon: Radio, label: 'Equipment monitoring' },
  { icon: Wrench, label: 'Maintenance coordination' },
  { icon: Activity, label: 'Observation planning' },
  { icon: CloudSun, label: 'Weather awareness' },
];

export default function AuthVisual({ eyebrow = 'Observatory operations platform' }) {
  return (
    <section className="relative hidden overflow-hidden bg-navy-950 lg:flex lg:w-[48%] lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      <div className="aw-grid-pattern pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -left-36 -top-32 h-[430px] w-[430px] rounded-full bg-primary-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-36 -right-28 h-[410px] w-[410px] rounded-full bg-violet-500/10 blur-3xl" />
      <div className="aw-orbit right-[-70px] top-[15%] h-[340px] w-[520px] rotate-[-18deg]" />
      <div className="aw-orbit right-[-20px] top-[21%] h-[250px] w-[410px] rotate-[-18deg] opacity-70" style={{ animationDelay: '-2.3s' }} />

      <div className="relative z-10 flex items-center gap-3">
        <BrandMark size={46} />
        <div>
          <p className="font-display text-xl font-semibold tracking-[-0.02em] text-white">AstroWatch</p>
          <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-500">Observatory Operations</p>
        </div>
      </div>

      <div className="relative z-10 max-w-xl py-10">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-primary-300">{eyebrow}</p>
        <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-[-0.035em] text-white xl:text-5xl">
          Keep every observing night <span className="text-primary-300">in sync.</span>
        </h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
          One operational workspace for equipment readiness, maintenance work, observing schedules, and local weather conditions.
        </p>

        <div className="mt-9 grid max-w-lg grid-cols-2 gap-3">
          {FEATURES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.045] px-3.5 py-3 text-sm text-slate-300 backdrop-blur-sm">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10 text-primary-300">
                <Icon size={16} />
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-2 text-xs text-slate-600">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Centralized observatory monitoring &amp; management
      </div>
    </section>
  );
}
