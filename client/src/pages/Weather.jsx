import { useEffect, useState } from 'react';
import { RefreshCw, Droplets, Wind, Cloud, Thermometer, AlertTriangle, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import weatherService from '../services/weatherService';
import Loader from '../components/common/Loader';

const SUITABILITY_STYLES = {
  Suitable: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Moderate: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Unfavorable: 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

const METRIC_ITEMS = (weather) => [
  { label: 'Feels Like', value: `${weather.feelsLike}°C`, icon: Thermometer },
  { label: 'Humidity', value: `${weather.humidity}%`, icon: Droplets },
  { label: 'Cloud Cover', value: `${weather.cloudCover}%`, icon: Cloud },
  { label: 'Wind Speed', value: `${weather.windSpeed} m/s`, icon: Wind },
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

  useEffect(() => {
    load();
  }, []);

  if (loading) return <Loader label="Fetching current weather..." />;

  if (!weather) {
    return (
      <div className="aw-card flex flex-col items-center gap-3 p-10 text-center">
        <AlertTriangle size={28} className="text-amber-500" />
        <p className="font-medium text-slate-700">Weather data is currently unavailable.</p>
        <button type="button" className="aw-btn-secondary" onClick={() => load()}>
          <RefreshCw size={15} /> Try Again
        </button>
      </div>
    );
  }

  const suitabilityClass = SUITABILITY_STYLES[weather.suitability?.level] || SUITABILITY_STYLES.Moderate;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="aw-card overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4 bg-gradient-to-br from-navy-900 to-navy-800 p-7 text-white">
          <div>
            <p className="text-sm text-slate-300">{weather.location}</p>
            <p className="font-display text-5xl font-semibold">{weather.temperature}°C</p>
            <p className="mt-1 capitalize text-slate-300">{weather.description || weather.condition}</p>
          </div>
          <button
            type="button"
            onClick={() => load(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20"
            disabled={refreshing}
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>

        <div className="grid grid-cols-2 gap-px bg-slate-100 sm:grid-cols-4">
          {METRIC_ITEMS(weather).map(({ label, value, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 bg-white p-5 text-center">
              <Icon size={18} className="text-slate-400" />
              <p className="text-sm font-semibold text-slate-800">{value}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="aw-card p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Observation Suitability</h3>
          <span className={`aw-badge ${suitabilityClass}`}>{weather.suitability?.level}</span>
        </div>
        <p className="text-sm text-slate-600">{weather.suitability?.reason}</p>
        <div className="mt-4 flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
          <Info size={14} className="mt-0.5 flex-shrink-0" />
          <p>
            This is a basic suitability indicator based on simple cloud cover, wind and condition thresholds -
            it is not a scientific astronomical forecast.
          </p>
        </div>
      </div>

      {weather.isDemoData && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-700">
          <AlertTriangle size={16} className="flex-shrink-0" />
          <p>
            <span className="font-medium">Demo data:</span> {weather.note || 'Configure OPENWEATHER_API_KEY in server/.env for live weather data.'}
          </p>
        </div>
      )}
    </div>
  );
}
