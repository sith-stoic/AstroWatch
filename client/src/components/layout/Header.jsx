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
  Admin: { icon: ShieldCheck, classes: 'bg-violet-400/10 text-violet-300 ring-violet-400/15' },
  Technician: { icon: Wrench, classes: 'bg-amber-400/10 text-amber-300 ring-amber-400/15' },
  Observer: { icon: Target, classes: 'bg-cyan-400/10 text-cyan-300 ring-cyan-400/15' },
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
    <header className="relative z-10 flex min-h-[74px] flex-shrink-0 items-center justify-between border-b border-white/[0.055] bg-[#080b13]/72 px-4 backdrop-blur-2xl sm:px-6 lg:px-8">
      <div className="min-w-0 py-3">
        <div className="flex items-center gap-3">
          <h1 className="truncate font-display text-lg font-semibold tracking-[-0.035em] text-slate-100 sm:text-xl">{title}</h1>
          <span className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ring-1 sm:inline-flex ${roleMeta.classes}`}>
            <RoleIcon size={11} strokeWidth={2.2} /> {user?.role}
          </span>
        </div>
        <p className="mt-1 hidden truncate text-[11px] font-medium text-slate-600 md:block">{subtitle} <span className="mx-1.5 text-slate-800">•</span> {today()}</p>
      </div>

      <div className="ml-4 flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="max-w-[180px] truncate text-sm font-semibold text-slate-200">{user?.name}</p>
          <p className="mt-0.5 text-[10px] text-slate-600">{user?.email}</p>
        </div>
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-violet-300/[0.12] bg-gradient-to-br from-violet-400/15 to-cyan-400/[0.07] text-xs font-bold text-violet-200 shadow-[0_0_30px_rgba(139,92,246,.08)]">
          {initials}
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#080b13] bg-emerald-400" />
        </div>
      </div>
    </header>
  );
}
