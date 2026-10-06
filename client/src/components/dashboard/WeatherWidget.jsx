import { Droplets, Wind, Cloud, Thermometer, AlertTriangle } from 'lucide-react';

const SUITABILITY_STYLES = {
  Suitable: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  Moderate: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  Unfavorable: 'bg-red-50 text-red-700 ring-1 ring-red-200',
};

// Compact weather summary - used on the Dashboard. See pages/Weather.jsx for the full detail view.
export default function WeatherWidget({ weather, loading }) {
  if (loading) {
    return <div className="aw-card p-5 text-sm text-slate-400">Loading weather...</div>;
  }

  if (!weather) {
    return (
      <div className="aw-card flex items-center gap-2 p-5 text-sm text-slate-500">
        <AlertTriangle size={16} className="text-amber-500" />
        Weather data is currently unavailable.
      </div>
    );
  }

  const suitabilityClass = SUITABILITY_STYLES[weather.suitability?.level] || SUITABILITY_STYLES.Moderate;

  return (
    <div className="aw-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{weather.location}</p>
          <p className="font-display text-3xl font-semibold text-slate-900">{weather.temperature}°C</p>
          <p className="text-sm capitalize text-slate-500">{weather.description || weather.condition}</p>
        </div>
        <span className={`aw-badge ${suitabilityClass}`}>{weather.suitability?.level}</span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-sm">
        <div className="flex items-center gap-1.5 text-slate-600">
          <Thermometer size={15} className="text-slate-400" />
          Feels {weather.feelsLike}°
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <Droplets size={15} className="text-slate-400" />
          {weather.humidity}%
        </div>
        <div className="flex items-center gap-1.5 text-slate-600">
          <Wind size={15} className="text-slate-400" />
          {weather.windSpeed} m/s
        </div>
      </div>

      {weather.isDemoData && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-amber-600">
          <Cloud size={13} /> Showing demo data ({weather.note || 'API key not configured'})
        </p>
      )}
    </div>
  );
}
