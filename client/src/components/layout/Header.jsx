import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/equipment': 'Equipment',
  '/maintenance': 'Maintenance',
  '/observations': 'Observations',
  '/weather': 'Weather Monitoring',
};

const resolveTitle = (pathname) => {
  const exact = PAGE_TITLES[pathname];
  if (exact) return exact;
  const base = '/' + pathname.split('/')[1];
  return PAGE_TITLES[base] || 'AstroWatch';
};

const today = () =>
  new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();

  const initials = (user?.name || 'U')
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{resolveTitle(location.pathname)}</h1>
        <p className="hidden text-xs text-slate-400 sm:block">{today()}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-800">{user?.name}</p>
          <p className="text-xs text-slate-400">{user?.role}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
          {initials}
        </div>
      </div>
    </header>
  );
}
