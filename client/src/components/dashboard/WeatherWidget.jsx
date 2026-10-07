import { AlertTriangle, Cloud, CloudSun, Droplets, Thermometer, Wind } from 'lucide-react';

const SUITABILITY_STYLES = {
  Suitable: 'bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20',
  Moderate: 'bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20',
  Unfavorable: 'bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/20',
};

export default function WeatherWidget({ weather, loading }) {
  if (loading) {
    return (
      <div className="aw-card min-h-[230px] overflow-hidden p-5">
        <div className="h-4 w-24 animate-pulse rounded bg-white/[0.055]" />
        <div className="mt-6 h-10 w-28 animate-pulse rounded-lg bg-white/[0.055]" />
        <div className="mt-3 h-4 w-32 animate-pulse rounded bg-white/[0.045]" />
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-12 animate-pulse rounded-xl bg-white/[0.035]" />)}
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="aw-card flex min-h-[230px] items-center justify-center p-6 text-center">
        <div>
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/15">
            <AlertTriangle size={20} />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-200">Weather unavailable</p>
          <p className="mt-1 text-xs text-slate-500">Current conditions could not be loaded.</p>
        </div>
      </div>
    );
  }

  const suitabilityClass = SUITABILITY_STYLES[weather.suitability?.level] || SUITABILITY_STYLES.Moderate;

  return (
    <div className="aw-card relative min-h-[230px] overflow-hidden border-cyan-300/[0.09] bg-[linear-gradient(145deg,#0d1520_0%,#101526_54%,#111023_100%)] p-5 text-white">
      <div className="pointer-events-none absolute -right-14 -top-12 h-44 w-44 rounded-full bg-cyan-400/[0.12] blur-[62px]" />
      <div className="pointer-events-none absolute -bottom-16 left-8 h-36 w-36 rounded-full bg-violet-500/[0.09] blur-[70px]" />
      <CloudSun size={82} strokeWidth={1.1} className="pointer-events-none absolute right-5 top-6 text-cyan-100/[0.055]" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,.6)]" />
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-200/55">Current conditions</p>
          </div>
          <p className="mt-2.5 text-sm font-semibold text-slate-300">{weather.location}</p>
          <p className="mt-1 font-display text-4xl font-semibold tracking-[-0.055em] text-white">{weather.temperature}°C</p>
          <p className="mt-1 text-sm capitalize text-slate-500">{weather.description || weather.condition}</p>
        </div>
        <span className={`aw-badge ${suitabilityClass}`}>{weather.suitability?.level}</span>
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-2 border-t border-white/[0.065] pt-4">
        <div className="rounded-xl border border-white/[0.045] bg-white/[0.025] p-2.5">
          <Thermometer size={14} className="text-violet-300" />
          <p className="mt-1.5 text-xs font-semibold text-slate-200">{weather.feelsLike}°</p>
          <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-600">Feels</p>
        </div>
        <div className="rounded-xl border border-white/[0.045] bg-white/[0.025] p-2.5">
          <Droplets size={14} className="text-cyan-300" />
          <p className="mt-1.5 text-xs font-semibold text-slate-200">{weather.humidity}%</p>
          <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-600">Humidity</p>
        </div>
        <div className="rounded-xl border border-white/[0.045] bg-white/[0.025] p-2.5">
          <Wind size={14} className="text-amber-300" />
          <p className="mt-1.5 text-xs font-semibold text-slate-200">{weather.windSpeed} m/s</p>
          <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.14em] text-slate-600">Wind</p>
        </div>
      </div>

      {weather.isDemoData && (
        <p className="relative mt-3 flex items-center gap-1.5 text-[9px] font-semibold text-amber-300/80">
          <Cloud size={12} /> Demo weather fallback active
        </p>
      )}
    </div>
  );
}
