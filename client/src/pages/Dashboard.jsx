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
  PlayCircle,
  Target,
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
import { useAuth } from '../context/AuthContext';

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setStats(await dashboardService.getStats());
      } catch (error) {
        toast.error(error.message || 'Could not load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    const loadWeather = async () => {
      try {
        setWeather(await weatherService.getCurrent());
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
  const role = stats?.role || user?.role;

  const commonCards = [
    { icon: Telescope, label: 'Total Equipment', value: cards.totalEquipment ?? 0, accent: 'blue' },
    { icon: CheckCircle2, label: 'Operational', value: cards.operationalEquipment ?? 0, accent: 'emerald' },
    { icon: Wrench, label: 'Under Maintenance', value: cards.maintenanceEquipment ?? 0, accent: 'cyan' },
    { icon: AlertTriangle, label: 'Warning / Offline', value: cards.warningOfflineEquipment ?? 0, accent: 'amber' },
  ];

  const roleCards = role === 'Technician'
    ? [
        { icon: ClipboardList, label: 'My Maintenance Tasks', value: cards.myMaintenanceTasks ?? 0, accent: 'violet' },
        { icon: Clock, label: 'My Pending Tasks', value: cards.pendingMaintenance ?? 0, accent: 'amber' },
        { icon: PlayCircle, label: 'In Progress', value: cards.inProgressMaintenance ?? 0, accent: 'blue' },
        { icon: CalendarCheck, label: 'Completed Tasks', value: cards.completedMaintenance ?? 0, accent: 'emerald' },
      ]
    : role === 'Observer'
      ? [
          { icon: Target, label: 'My Observations', value: cards.myObservations ?? 0, accent: 'violet' },
          { icon: CalendarClock, label: 'Upcoming', value: cards.upcomingObservations ?? 0, accent: 'blue' },
          { icon: PlayCircle, label: 'In Progress', value: cards.inProgressObservations ?? 0, accent: 'amber' },
          { icon: CalendarCheck, label: 'Completed', value: cards.completedObservations ?? 0, accent: 'emerald' },
        ]
      : [
          { icon: ClipboardList, label: 'Total Maintenance Tasks', value: cards.totalMaintenanceTasks ?? 0, accent: 'violet' },
          { icon: Clock, label: 'Pending Maintenance', value: cards.pendingMaintenance ?? 0, accent: 'amber' },
          { icon: CalendarClock, label: 'Upcoming Observations', value: cards.upcomingObservations ?? 0, accent: 'blue' },
          { icon: CalendarCheck, label: 'Completed Observations', value: cards.completedObservations ?? 0, accent: 'emerald' },
        ];

  return (
    <div className="space-y-6">
      {role !== 'Admin' && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
          <span className="font-semibold text-slate-800">{role} workspace:</span>{' '}
          {role === 'Technician'
            ? 'maintenance counts and upcoming tasks are scoped to assignments made to your account.'
            : 'observation counts and upcoming sessions are scoped to assignments made to your account.'}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...commonCards, ...roleCards].map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <WeatherWidget weather={weather} loading={weatherLoading} />
        </div>

        <div className="aw-card p-5 lg:col-span-1">
          <h3 className="mb-4 text-sm font-semibold text-slate-800">Equipment Status Overview</h3>
          <EquipmentStatusChart data={stats?.equipmentByStatus} />
        </div>

        <div className="aw-card p-5 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <Activity size={16} className="text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-800">Recent Equipment Activity</h3>
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

      {(role === 'Admin' || role === 'Observer') && (
        <div className="aw-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">{role === 'Observer' ? 'My Upcoming Observations' : 'Upcoming Observations'}</h3>
            <Link to="/observations" className="text-xs font-medium text-primary-600 hover:text-primary-700">View all</Link>
          </div>
          {stats?.upcomingObservationsList?.length ? (
            <ul className="divide-y divide-slate-100">
              {stats.upcomingObservationsList.map((obs) => (
                <li key={obs._id} className="flex items-center justify-between py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">{obs.target}</p>
                    <p className="truncate text-xs text-slate-400">
                      {obs.equipment?.name} · {formatDate(obs.date)} · {obs.startTime}–{obs.endTime}
                      {role === 'Admin' && obs.observer?.name ? ` · ${obs.observer.name}` : ''}
                    </p>
                  </div>
                  <StatusBadge value={obs.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No upcoming observations" message={role === 'Observer' ? 'No observation is currently assigned to you.' : 'Schedule one from the Observations page.'} />
          )}
        </div>
      )}

      {(role === 'Admin' || role === 'Technician') && (
        <div className="aw-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800">{role === 'Technician' ? 'My Upcoming Maintenance' : 'Upcoming Maintenance'}</h3>
            <Link to="/maintenance" className="text-xs font-medium text-primary-600 hover:text-primary-700">View all</Link>
          </div>
          {stats?.upcomingMaintenanceList?.length ? (
            <ul className="divide-y divide-slate-100">
              {stats.upcomingMaintenanceList.map((task) => (
                <li key={task._id} className="flex items-center justify-between py-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">{task.title}</p>
                    <p className="truncate text-xs text-slate-400">
                      {task.equipment?.name} · {formatDate(task.scheduledDate)}
                      {role === 'Admin' && task.assignedTo?.name ? ` · ${task.assignedTo.name}` : ''}
                    </p>
                  </div>
                  <StatusBadge value={task.status} />
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No upcoming maintenance" message={role === 'Technician' ? 'No maintenance task is currently assigned to you.' : 'Add a task from the Maintenance page.'} />
          )}
        </div>
      )}
    </div>
  );
}
