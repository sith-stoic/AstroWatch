import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Telescope,
  CheckCircle2,
  Wrench,
  AlertTriangle,
  ClipboardList,
  Clock,
  CalendarClock,
  CalendarCheck,
  Activity,
} from 'lucide-react';
import toast from 'react-hot-toast';
import dashboardService from '../services/dashboardService';
import weatherService from '../services/weatherService';
import StatCard from '../components/dashboard/StatCard';
import WeatherWidget from '../components/dashboard/WeatherWidget';
import EquipmentStatusChart from '../components/dashboard/EquipmentStatusChart';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await dashboardService.getStats();
        setStats(data);
      } catch (error) {
        toast.error(error.message || 'Could not load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    const loadWeather = async () => {
      try {
        const data = await weatherService.getCurrent();
        setWeather(data);
      } catch (error) {
        setWeather(null);
      } finally {
        setWeatherLoading(false);
      }
    };

    load();
    loadWeather();
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  const cards = stats?.cards || {};

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Telescope} label="Total Equipment" value={cards.totalEquipment ?? 0} accent="blue" />
        <StatCard icon={CheckCircle2} label="Operational" value={cards.operationalEquipment ?? 0} accent="emerald" />
        <StatCard icon={Wrench} label="Under Maintenance" value={cards.maintenanceEquipment ?? 0} accent="cyan" />
        <StatCard icon={AlertTriangle} label="Warning / Offline" value={cards.warningOfflineEquipment ?? 0} accent="amber" />
        <StatCard icon={ClipboardList} label="Total Maintenance Tasks" value={cards.totalMaintenanceTasks ?? 0} accent="violet" />
        <StatCard icon={Clock} label="Pending Maintenance" value={cards.pendingMaintenance ?? 0} accent="amber" />
        <StatCard icon={CalendarClock} label="Upcoming Observations" value={cards.upcomingObservations ?? 0} accent="blue" />
        <StatCard icon={CalendarCheck} label="Completed Observations" value={cards.completedObservations ?? 0} accent="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Weather */}
        <div className="lg:col-span-1">
          <WeatherWidget weather={weather} loading={weatherLoading} />
        </div>

        {/* Equipment status breakdown */}
        <div className="aw-card p-5 lg:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">Equipment Status Overview</h3>
          <EquipmentStatusChart data={stats?.equipmentByStatus} />
        </div>

        {/* Recent activity */}
        <div className="aw-card p-5 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <Activity size={16} className="text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-800">Recent Activity</h3>
          </div>
          {stats?.recentActivity?.length ? (
            <ul className="space-y-3">
              {stats.recentActivity.map((item, idx) => (
                <li key={idx} className="flex items-center justify-between text-sm">
                  <span className="truncate text-slate-600">{item.name}</span>
                  <StatusBadge value={item.status} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400">No recent equipment updates.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming observations */}
        <div className="aw-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Upcoming Observations</h3>
            <Link to="/observations" className="text-xs font-medium text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          {stats?.upcomingObservationsList?.length ? (
            <ul className="divide-y divide-slate-100">
              {stats.upcomingObservationsList.map((obs) => (
                <li key={obs._id} className="flex items-center justify-between py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">{obs.target}</p>
                    <p className="truncate text-xs text-slate-400">
                      {obs.equipment?.name} · {formatDate(obs.date)} · {obs.startTime}–{obs.endTime}
                    </p>
                  </div>
                  <StatusBadge value={obs.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No upcoming observations" message="Schedule one from the Observations page." />
          )}
        </div>

        {/* Upcoming maintenance */}
        <div className="aw-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">Upcoming Maintenance</h3>
            <Link to="/maintenance" className="text-xs font-medium text-primary-600 hover:text-primary-700">
              View all
            </Link>
          </div>
          {stats?.upcomingMaintenanceList?.length ? (
            <ul className="divide-y divide-slate-100">
              {stats.upcomingMaintenanceList.map((task) => (
                <li key={task._id} className="flex items-center justify-between py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">{task.title}</p>
                    <p className="truncate text-xs text-slate-400">
                      {task.equipment?.name} · {formatDate(task.scheduledDate)} · {task.assignedTo}
                    </p>
                  </div>
                  <StatusBadge value={task.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No upcoming maintenance" message="Add a task from the Maintenance page." />
          )}
        </div>
      </div>
    </div>
  );
}
