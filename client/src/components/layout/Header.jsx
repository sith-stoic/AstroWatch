import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Wrench, Target } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard': ['Dashboard', 'Observatory operations overview'],
  '/equipment': ['Equipment', 'Monitor observatory assets and operating condition'],
  '/maintenance': ['Maintenance', 'Track service work and equipment readiness'],
  '/observations': ['Observations', 'Coordinate observing sessions and assignments'],
  '/weather': ['Weather Monitoring', 'Current local conditions for observation planning'],
};

const resolvePage = (pathname) => {
  const exact = PAGE_TITLES[pathname];
  if (exact) return exact;
  const base = '/' + pathname.split('/')[1];
  const basePage = PAGE_TITLES[base] || ['AstroWatch', 'Observatory operations'];
  if (pathname.includes('/add')) return [`Add ${basePage[0].replace(/s$/, '')}`, basePage[1]];
  if (pathname.includes('/edit')) return [`Update ${basePage[0].replace(/s$/, '')}`, basePage[1]];
  return basePage;
};

const today = () =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const ROLE_META = {
  Admin: { icon: ShieldCheck, classes: 'bg-violet-50 text-violet-700 ring-violet-100' },
  Technician: { icon: Wrench, classes: 'bg-cyan-50 text-cyan-700 ring-cyan-100' },
  Observer: { icon: Target, classes: 'bg-primary-50 text-primary-700 ring-primary-100' },
};

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const [title, subtitle] = resolvePage(location.pathname);
  const roleMeta = ROLE_META[user?.role] || ROLE_META.Observer;
  const RoleIcon = roleMeta.icon;

  const initials = (user?.name || 'U')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="relative z-10 flex min-h-[72px] flex-shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="min-w-0 py-3">
        <div className="flex items-center gap-3">
          <h1 className="truncate text-lg font-semibold tracking-[-0.01em] text-slate-950 sm:text-xl">{title}</h1>
          <span className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ring-1 sm:inline-flex ${roleMeta.classes}`}>
            <RoleIcon size={11} strokeWidth={2.2} /> {user?.role}
          </span>
        </div>
        <p className="mt-0.5 hidden truncate text-xs text-slate-400 md:block">{subtitle} · {today()}</p>
      </div>

      <div className="ml-4 flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-[180px] truncate text-sm font-semibold text-slate-800">{user?.name}</p>
          <p className="text-[11px] text-slate-400">{user?.email}</p>
        </div>
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-violet-100 text-sm font-bold text-primary-700 ring-1 ring-primary-100">
          {initials}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
        </div>
      </div>
    </header>
  );
}
