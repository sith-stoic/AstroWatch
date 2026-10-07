import { AlertTriangle, Cloud, CloudSun, Droplets, Thermometer, Wind } from 'lucide-react';

const SUITABILITY_STYLES = {
  Suitable: 'bg-emerald-400/15 text-emerald-100 ring-1 ring-emerald-300/20',
  Moderate: 'bg-amber-400/15 text-amber-100 ring-1 ring-amber-300/20',
  Unfavorable: 'bg-red-400/15 text-red-100 ring-1 ring-red-300/20',
};

export default function WeatherWidget({ weather, loading }) {
  if (loading) {
    return (
      <div className="aw-card min-h-[230px] overflow-hidden p-5">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
        <div className="mt-6 h-10 w-28 animate-pulse rounded-lg bg-slate-100" />
        <div className="mt-3 h-4 w-32 animate-pulse rounded bg-slate-100" />
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-12 animate-pulse rounded-xl bg-slate-50" />)}
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="aw-card flex min-h-[230px] items-center justify-center p-6 text-center">
        <div>
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle size={20} />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-700">Weather unavailable</p>
          <p className="mt-1 text-xs text-slate-400">Current conditions could not be loaded.</p>
        </div>
      </div>
    );
  }

  const suitabilityClass = SUITABILITY_STYLES[weather.suitability?.level] || SUITABILITY_STYLES.Moderate;

  return (
    <div className="aw-card relative min-h-[230px] overflow-hidden border-navy-800 bg-gradient-to-br from-navy-900 via-navy-900 to-[#172554] p-5 text-white shadow-[0_16px_40px_rgba(15,23,42,0.16)]">
      <div className="pointer-events-none absolute -right-12 -top-10 h-40 w-40 rounded-full bg-primary-500/20 blur-3xl" />
      <CloudSun size={78} strokeWidth={1.2} className="pointer-events-none absolute right-5 top-6 text-white/[0.055]" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Current conditions</p>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-200">{weather.location}</p>
          <p className="mt-1 font-display text-4xl font-semibold tracking-[-0.04em]">{weather.temperature}°C</p>
          <p className="mt-1 text-sm capitalize text-slate-400">{weather.description || weather.condition}</p>
        </div>
        <span className={`aw-badge ${suitabilityClass}`}>{weather.suitability?.level}</span>
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-2 border-t border-white/[0.08] pt-4">
        <div className="rounded-xl bg-white/[0.045] p-2.5">
          <Thermometer size={14} className="text-primary-300" />
          <p className="mt-1.5 text-xs font-semibold text-slate-200">{weather.feelsLike}°</p>
          <p className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-500">Feels</p>
        </div>
        <div className="rounded-xl bg-white/[0.045] p-2.5">
          <Droplets size={14} className="text-cyan-300" />
          <p className="mt-1.5 text-xs font-semibold text-slate-200">{weather.humidity}%</p>
          <p className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-500">Humidity</p>
        </div>
        <div className="rounded-xl bg-white/[0.045] p-2.5">
          <Wind size={14} className="text-violet-300" />
          <p className="mt-1.5 text-xs font-semibold text-slate-200">{weather.windSpeed} m/s</p>
          <p className="mt-0.5 text-[9px] uppercase tracking-wider text-slate-500">Wind</p>
        </div>
      </div>

      {weather.isDemoData && (
        <p className="relative mt-3 flex items-center gap-1.5 text-[10px] text-amber-300/90">
          <Cloud size={12} /> Demo weather fallback active
        </p>
      )}
    </div>
  );
}
