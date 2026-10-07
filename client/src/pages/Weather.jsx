import { useEffect, useState } from 'react';
import { AlertTriangle, Cloud, CloudSun, Droplets, Info, RefreshCw, Thermometer, Wind } from 'lucide-react';
import toast from 'react-hot-toast';
import weatherService from '../services/weatherService';
import Loader from '../components/common/Loader';
import Reveal from '../components/common/Reveal';

const SUITABILITY_STYLES = {
  Suitable: 'bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/20',
  Moderate: 'bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/20',
  Unfavorable: 'bg-rose-400/10 text-rose-300 ring-1 ring-rose-400/20',
};

const METRIC_ITEMS = (weather) => [
  { label: 'Feels Like', value: `${weather.feelsLike}°C`, icon: Thermometer, accent: 'bg-violet-400/10 text-violet-300 ring-1 ring-violet-400/15' },
  { label: 'Humidity', value: `${weather.humidity}%`, icon: Droplets, accent: 'bg-cyan-400/10 text-cyan-300 ring-1 ring-cyan-400/15' },
  { label: 'Cloud Cover', value: `${weather.cloudCover}%`, icon: Cloud, accent: 'bg-fuchsia-400/10 text-fuchsia-300 ring-1 ring-fuchsia-400/15' },
  { label: 'Wind Speed', value: `${weather.windSpeed} m/s`, icon: Wind, accent: 'bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/15' },
];

export default function Weather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await weatherService.getCurrent();
      setWeather(data);
    } catch (error) {
      toast.error(error.message || 'Weather data is currently unavailable.');
      setWeather(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Loader label="Fetching current weather..." />;

  if (!weather) {
    return (
      <div className="aw-card mx-auto flex max-w-2xl flex-col items-center gap-3 p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600"><AlertTriangle size={22} /></div>
        <p className="font-semibold text-slate-800">Weather data is currently unavailable.</p>
        <p className="text-sm text-slate-400">Retry the connection to refresh local observing conditions.</p>
        <button type="button" className="aw-btn-secondary mt-2" onClick={() => load()}><RefreshCw size={15} /> Try Again</button>
      </div>
    );
  }

  const suitabilityClass = SUITABILITY_STYLES[weather.suitability?.level] || SUITABILITY_STYLES.Moderate;

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-cyan-300/[0.09] bg-[linear-gradient(135deg,#0c1520_0%,#101426_55%,#14101f_100%)] p-7 text-white shadow-[0_20px_55px_rgba(15,23,42,0.16)] sm:p-8">
          <div className="aw-grid-pattern pointer-events-none absolute inset-0 opacity-30" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-400/[0.13] blur-3xl" />
          <CloudSun size={185} strokeWidth={0.7} className="pointer-events-none absolute right-8 top-1/2 hidden -translate-y-1/2 text-white/[0.045] sm:block" />

          <div className="relative flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300/80">Live weather station</p></div>
              <p className="mt-3 text-sm font-semibold text-slate-300">{weather.location}</p>
              <div className="mt-1 flex items-end gap-4">
                <p className="font-display text-6xl font-semibold tracking-[-0.055em]">{weather.temperature}°</p>
                <div className="pb-2"><p className="text-sm font-semibold capitalize text-slate-300">{weather.description || weather.condition}</p><p className="mt-1 text-xs text-slate-500">Current local conditions</p></div>
              </div>
            </div>
            <button type="button" onClick={() => load(true)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.055] px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/[0.1]" disabled={refreshing}>
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> {refreshing ? 'Refreshing...' : 'Refresh conditions'}
            </button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={70}>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {METRIC_ITEMS(weather).map(({ label, value, icon: Icon, accent }) => (
            <div key={label} className="aw-card aw-card-interactive p-5">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accent}`}><Icon size={18} /></div>
              <p className="mt-4 font-display text-xl font-semibold tracking-[-0.02em] text-slate-900">{value}</p>
              <p className="mt-1 text-xs font-medium text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={120}>
        <div className="aw-card p-6 sm:p-7">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Planning indicator</p>
              <h3 className="mt-1 font-display text-lg font-semibold text-slate-900">Observation Suitability</h3>
            </div>
            <span className={`aw-badge ${suitabilityClass}`}>{weather.suitability?.level}</span>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{weather.suitability?.reason}</p>
          <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-xs leading-5 text-slate-500">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white/[0.035] text-slate-400 ring-1 ring-white/[0.05]"><Info size={14} /></div>
            <p>This is a basic suitability indicator based on simple cloud cover, wind and condition thresholds. It supports planning but is not a scientific astronomical forecast.</p>
          </div>
        </div>
      </Reveal>

      {weather.isDemoData && (
        <Reveal delay={160}>
          <div className="flex items-start gap-3 rounded-2xl border border-amber-400/15 bg-amber-400/[0.055] p-4 text-sm text-amber-200">
            <AlertTriangle size={17} className="mt-0.5 flex-shrink-0" />
            <p><span className="font-semibold">Demo weather fallback:</span> {weather.note || 'Configure OPENWEATHER_API_KEY in server/.env for live weather data.'}</p>
          </div>
        </Reveal>
      )}
    </div>
  );
}
