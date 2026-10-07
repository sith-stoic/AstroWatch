import { Activity, CloudSun, Radio, Wrench } from 'lucide-react';
import BrandMark from './BrandMark';

const FEATURES = [
  { icon: Radio, label: 'Equipment monitoring', tone: 'text-violet-300 bg-violet-400/10 border-violet-300/10' },
  { icon: Wrench, label: 'Maintenance coordination', tone: 'text-amber-300 bg-amber-400/10 border-amber-300/10' },
  { icon: Activity, label: 'Observation planning', tone: 'text-fuchsia-300 bg-fuchsia-400/10 border-fuchsia-300/10' },
  { icon: CloudSun, label: 'Weather awareness', tone: 'text-cyan-300 bg-cyan-400/10 border-cyan-300/10' },
];

export default function AuthVisual({ eyebrow = 'Observatory operations platform' }) {
  return (
    <section className="relative hidden overflow-hidden border-r border-white/[0.055] bg-[#070912] lg:flex lg:w-[48%] lg:flex-col lg:justify-between lg:p-12 xl:p-16">
      <div className="aw-grid-pattern pointer-events-none absolute inset-0 opacity-45" />
      <div className="pointer-events-none absolute -left-32 -top-36 h-[460px] w-[460px] rounded-full bg-violet-600/20 blur-[110px]" />
      <div className="pointer-events-none absolute -bottom-36 -right-24 h-[440px] w-[440px] rounded-full bg-cyan-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute left-[44%] top-[36%] h-48 w-48 rounded-full bg-fuchsia-500/[0.055] blur-[90px]" />
      <div className="aw-orbit right-[-110px] top-[14%] h-[365px] w-[570px] rotate-[-18deg]" />
      <div className="aw-orbit right-[-48px] top-[20%] h-[270px] w-[455px] rotate-[-18deg] opacity-60" style={{ animationDelay: '-2.3s' }} />

      <div className="relative z-10 flex items-center gap-3.5">
        <BrandMark size={52} />
        <div>
          <p className="font-display text-xl font-semibold tracking-[-0.035em] text-white">AstroWatch</p>
          <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.24em] text-slate-500">Observatory Operations</p>
        </div>
      </div>

      <div className="relative z-10 max-w-xl py-10">
        <div className="mb-5 flex items-center gap-2.5">
          <span className="h-px w-8 bg-gradient-to-r from-amber-300 to-transparent" />
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-amber-300/90">{eyebrow}</p>
        </div>
        <h1 className="font-display text-[2.55rem] font-semibold leading-[1.08] tracking-[-0.048em] text-white xl:text-[3.25rem]">
          Monitor. Maintain.<br />
          <span className="aw-cosmic-text">Observe.</span>
        </h1>
        <p className="mt-6 max-w-lg text-[15px] leading-7 text-slate-400">
          A single operations console for keeping observatory equipment ready, service work coordinated, and observing windows on track.
        </p>

        <div className="mt-9 grid max-w-lg grid-cols-2 gap-3">
          {FEATURES.map(({ icon: Icon, label, tone }) => (
            <div key={label} className="flex items-center gap-2.5 rounded-2xl border border-white/[0.065] bg-white/[0.032] px-3.5 py-3.5 text-sm font-medium text-slate-300 backdrop-blur-sm">
              <span className={`flex h-8 w-8 items-center justify-center rounded-xl border ${tone}`}>
                <Icon size={16} strokeWidth={1.9} />
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between gap-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-35" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Operations online
        </span>
        <span>Est. 2026</span>
      </div>
    </section>
  );
}
