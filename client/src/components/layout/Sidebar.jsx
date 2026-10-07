import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Telescope,
  Wrench,
  Target,
  CloudSun,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  ShieldCheck,
  CircleUserRound,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';
import BrandMark from '../common/BrandMark';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Technician', 'Observer'] },
  { to: '/equipment', label: 'Equipment', icon: Telescope, roles: ['Admin', 'Technician', 'Observer'] },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['Admin', 'Technician'] },
  { to: '/observations', label: 'Observations', icon: Target, roles: ['Admin', 'Observer'] },
  { to: '/weather', label: 'Weather', icon: CloudSun, roles: ['Admin', 'Technician', 'Observer'] },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user?.role));

  return (
    <aside
      className={`relative z-20 flex h-screen flex-shrink-0 flex-col overflow-hidden border-r border-white/5 bg-navy-900 text-slate-200 shadow-[10px_0_35px_rgba(15,23,42,0.08)] transition-[width] duration-300 ease-out ${
        collapsed ? 'w-[76px]' : 'w-64'
      }`}
    >
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-primary-600/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-14 right-0 h-48 w-48 rounded-full bg-violet-500/5 blur-3xl" />

      <div className={`relative flex items-center ${collapsed ? 'justify-center px-3' : 'gap-3 px-5'} py-5`}>
        <BrandMark size={40} className="flex-shrink-0 rounded-xl" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display text-[17px] font-semibold leading-tight tracking-[-0.02em] text-white">AstroWatch</p>
            <p className="mt-0.5 truncate text-[10.5px] font-medium uppercase tracking-[0.11em] text-slate-500">Observatory Operations</p>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="relative mx-4 mb-4 rounded-xl border border-white/5 bg-white/[0.035] px-3 py-2.5">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Operations console online
          </div>
        </div>
      )}

      <nav className="relative flex-1 space-y-1.5 px-3">
        {!collapsed && <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">Workspace</p>}
        {visibleItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-950/20'
                  : 'text-slate-400 hover:bg-white/[0.055] hover:text-white'
              }`
            }
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-white/80" />}
                <Icon size={18} className="relative flex-shrink-0 transition-transform duration-200 group-hover:scale-105" strokeWidth={1.9} />
                {!collapsed && <span className="relative">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative border-t border-white/[0.06] px-3 py-4">
        {!collapsed && (
          <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-white/[0.035] px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.07] text-slate-300">
              {user?.role === 'Admin' ? <ShieldCheck size={16} /> : <CircleUserRound size={16} />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-200">{user?.name}</p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{user?.role}</p>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.055] hover:text-white"
            title={collapsed ? 'Expand sidebar' : undefined}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!collapsed && <span>Collapse</span>}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
