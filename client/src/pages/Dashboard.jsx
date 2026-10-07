import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock,
  Plus,
  PlayCircle,
  Radar,
  Target,
  Telescope,
  Wrench,
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
import Reveal from '../components/common/Reveal';
import { useAuth } from '../context/AuthContext';

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const firstName = (name = '') => name.trim().split(' ')[0] || 'there';

const ROLE_COPY = {
  Admin: {
    eyebrow: 'Observatory command overview',
    title: 'Operations at a glance',
    message: 'Monitor equipment readiness, coordinate maintenance, and keep observation schedules moving from one control point.',
  },
  Technician: {
    eyebrow: 'Maintenance workspace',
    title: 'Keep the observatory mission-ready',
    message: 'Your dashboard is scoped to maintenance assigned to your account. Update progress as work moves from scheduled to completed.',
  },
  Observer: {
    eyebrow: 'Observation workspace',
    title: 'Your observing schedule, organized',
    message: 'Your dashboard is scoped to sessions assigned to your account. Track upcoming observations and update session progress.',
  },
};

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
  const role = stats?.role || user?.role || 'Observer';
  const roleCopy = ROLE_COPY[role] || ROLE_COPY.Observer;

  const commonCards = [
    { icon: Telescope, label: 'Total Equipment', value: cards.totalEquipment ?? 0, accent: 'blue', detail: 'Registered assets' },
    { icon: CheckCircle2, label: 'Operational', value: cards.operationalEquipment ?? 0, accent: 'emerald', detail: 'Ready for use' },
    { icon: Wrench, label: 'Under Maintenance', value: cards.maintenanceEquipment ?? 0, accent: 'cyan', detail: 'Service state' },
    { icon: AlertTriangle, label: 'Warning / Offline', value: cards.warningOfflineEquipment ?? 0, accent: 'amber', detail: 'Needs attention' },
  ];

  const roleCards = role === 'Technician'
    ? [
        { icon: ClipboardList, label: 'My Maintenance Tasks', value: cards.myMaintenanceTasks ?? 0, accent: 'violet', detail: 'Assigned to you' },
        { icon: Clock, label: 'My Pending Tasks', value: cards.pendingMaintenance ?? 0, accent: 'amber', detail: 'Awaiting completion' },
        { icon: PlayCircle, label: 'In Progress', value: cards.inProgressMaintenance ?? 0, accent: 'blue', detail: 'Currently active' },
        { icon: CalendarCheck, label: 'Completed Tasks', value: cards.completedMaintenance ?? 0, accent: 'emerald', detail: 'Service history' },
      ]
    : role === 'Observer'
      ? [
          { icon: Target, label: 'My Observations', value: cards.myObservations ?? 0, accent: 'violet', detail: 'Assigned sessions' },
          { icon: CalendarClock, label: 'Upcoming', value: cards.upcomingObservations ?? 0, accent: 'blue', detail: 'Scheduled next' },
          { icon: PlayCircle, label: 'In Progress', value: cards.inProgressObservations ?? 0, accent: 'amber', detail: 'Active sessions' },
          { icon: CalendarCheck, label: 'Completed', value: cards.completedObservations ?? 0, accent: 'emerald', detail: 'Observation history' },
        ]
      : [
          { icon: ClipboardList, label: 'Total Maintenance Tasks', value: cards.totalMaintenanceTasks ?? 0, accent: 'violet', detail: 'All service work' },
          { icon: Clock, label: 'Pending Maintenance', value: cards.pendingMaintenance ?? 0, accent: 'amber', detail: 'Needs follow-up' },
          { icon: CalendarClock, label: 'Upcoming Observations', value: cards.upcomingObservations ?? 0, accent: 'blue', detail: 'Scheduled sessions' },
          { icon: CalendarCheck, label: 'Completed Observations', value: cards.completedObservations ?? 0, accent: 'emerald', detail: 'Finished sessions' },
        ];

  const quickActions = role === 'Admin'
    ? [
        { to: '/equipment/add', label: 'Add equipment', icon: Telescope },
        { to: '/maintenance/add', label: 'Assign maintenance', icon: Wrench },
        { to: '/observations/add', label: 'Schedule observation', icon: Target },
      ]
    : role === 'Technician'
      ? [{ to: '/maintenance', label: 'Open my maintenance', icon: Wrench }]
      : [{ to: '/observations', label: 'Open my observations', icon: Target }];

  return (
    <div className="space-y-7 pb-2">
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl border border-violet-300/[0.10] bg-[linear-gradient(135deg,#12101f_0%,#0d111d_48%,#071820_100%)] px-6 py-7 text-white shadow-[0_20px_55px_rgba(15,23,42,0.16)] sm:px-8 sm:py-8">
          <div className="aw-grid-pattern pointer-events-none absolute inset-0 opacity-30" />
          <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-violet-500/[0.16] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-[45%] h-56 w-56 rounded-full bg-cyan-400/[0.08] blur-3xl" />
          <Radar size={170} strokeWidth={0.65} className="pointer-events-none absolute -right-5 top-1/2 hidden -translate-y-1/2 text-white/[0.045] sm:block" />

          <div className="relative flex flex-col justify-between gap-7 xl:flex-row xl:items-end">
            <div className="max-w-3xl">
              <div className="mb-3 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_5px_rgba(52,211,153,0.08)]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-300/85">{roleCopy.eyebrow}</p>
              </div>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                Good to see you, {firstName(user?.name)}. <span className="text-slate-400">{roleCopy.title}</span>
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{roleCopy.message}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {quickActions.map(({ to, label, icon: Icon }, index) => (
                <Link
                  key={to}
                  to={to}
                  className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 active:scale-[0.98] ${
                    index === 0
                      ? 'bg-violet-300 text-[#15101d] shadow-[0_8px_28px_rgba(167,139,250,.2)] hover:bg-violet-200'
                      : 'border border-white/[0.08] bg-white/[0.035] text-slate-300 hover:border-violet-300/20 hover:bg-violet-400/[0.07] hover:text-violet-200'
                  }`}
                >
                  {role === 'Admin' && index === 0 ? <Plus size={14} /> : <Icon size={14} />}
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal delay={60}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {commonCards.map((card) => <StatCard key={card.label} {...card} />)}
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div>
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">{role === 'Admin' ? 'Operations' : 'My workspace'}</p>
              <h3 className="mt-1 font-display text-lg font-semibold tracking-[-0.02em] text-slate-900">Workload snapshot</h3>
            </div>
            {role !== 'Admin' && (
              <p className="hidden max-w-lg text-right text-xs leading-5 text-slate-400 md:block">
                Counts below are scoped to work assigned directly to your {role} account.
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {roleCards.map((card) => <StatCard key={card.label} {...card} />)}
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <Reveal className="xl:col-span-1" delay={130}>
          <WeatherWidget weather={weather} loading={weatherLoading} />
        </Reveal>

        <Reveal className="xl:col-span-1" delay={170}>
          <div className="aw-card h-full p-5 sm:p-6">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Fleet health</p>
                <h3 className="mt-1 text-sm font-semibold text-slate-800">Equipment Status Overview</h3>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300 ring-1 ring-indigo-400/15">
                <Telescope size={17} />
              </div>
            </div>
            <EquipmentStatusChart data={stats?.equipmentByStatus} />
          </div>
        </Reveal>

        <Reveal className="xl:col-span-1" delay={210}>
          <div className="aw-card h-full p-5 sm:p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Latest changes</p>
                <h3 className="mt-1 text-sm font-semibold text-slate-800">Recent Equipment Activity</h3>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-400/10 text-fuchsia-300 ring-1 ring-fuchsia-400/15">
                <Activity size={17} />
              </div>
            </div>
            {stats?.recentActivity?.length ? (
              <ul className="space-y-1">
                {stats.recentActivity.map((item, idx) => (
                  <li key={`${item.name}-${idx}`} className="flex items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-slate-50">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-slate-300" />
                      <span className="truncate text-sm font-medium text-slate-600">{item.name}</span>
                    </div>
                    <StatusBadge value={item.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-400">No recent equipment updates.</p>
            )}
          </div>
        </Reveal>
      </div>

      {(role === 'Admin' || role === 'Observer') && (
        <Reveal delay={120}>
          <div className="aw-card overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Observation queue</p>
                <h3 className="mt-1 text-sm font-semibold text-slate-800">{role === 'Observer' ? 'My Upcoming Observations' : 'Upcoming Observations'}</h3>
              </div>
              <Link to="/observations" className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700">
                View all <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            {stats?.upcomingObservationsList?.length ? (
              <ul className="divide-y divide-slate-100 px-2 sm:px-3">
                {stats.upcomingObservationsList.map((obs) => (
                  <li key={obs._id} className="flex items-center justify-between gap-4 rounded-xl px-3 py-3.5 text-sm transition-colors hover:bg-slate-50/80">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-fuchsia-400/10 text-fuchsia-300 ring-1 ring-fuchsia-400/15">
                        <Target size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">{obs.target}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {obs.equipment?.name} · {formatDate(obs.date)} · {obs.startTime}–{obs.endTime}
                          {role === 'Admin' && obs.observer?.name ? ` · ${obs.observer.name}` : ''}
                        </p>
                      </div>
                    </div>
                    <StatusBadge value={obs.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No upcoming observations" message={role === 'Observer' ? 'No observation is currently assigned to you.' : 'Schedule one from the Observations page.'} />
            )}
          </div>
        </Reveal>
      )}

      {(role === 'Admin' || role === 'Technician') && (
        <Reveal delay={150}>
          <div className="aw-card overflow-hidden">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Maintenance queue</p>
                <h3 className="mt-1 text-sm font-semibold text-slate-800">{role === 'Technician' ? 'My Upcoming Maintenance' : 'Upcoming Maintenance'}</h3>
              </div>
              <Link to="/maintenance" className="group inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700">
                View all <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            {stats?.upcomingMaintenanceList?.length ? (
              <ul className="divide-y divide-slate-100 px-2 sm:px-3">
                {stats.upcomingMaintenanceList.map((task) => (
                  <li key={task._id} className="flex items-center justify-between gap-4 rounded-xl px-3 py-3.5 text-sm transition-colors hover:bg-slate-50/80">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/15">
                        <Wrench size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-800">{task.title}</p>
                        <p className="mt-0.5 truncate text-xs text-slate-400">
                          {task.equipment?.name} · {formatDate(task.scheduledDate)}
                          {role === 'Admin' && task.assignedTo?.name ? ` · ${task.assignedTo.name}` : ''}
                        </p>
                      </div>
                    </div>
                    <StatusBadge value={task.status} />
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No upcoming maintenance" message={role === 'Technician' ? 'No maintenance task is currently assigned to you.' : 'Add a task from the Maintenance page.'} />
            )}
          </div>
        </Reveal>
      )}
    </div>
  );
}
