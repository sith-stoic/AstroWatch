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
  {
    to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Technician', 'Observer'],
    active: 'bg-violet-400/10 text-violet-200 ring-1 ring-inset ring-violet-400/15',
    marker: 'bg-violet-300',
  },
  {
    to: '/equipment', label: 'Equipment', icon: Telescope, roles: ['Admin', 'Technician', 'Observer'],
    active: 'bg-indigo-400/10 text-indigo-200 ring-1 ring-inset ring-indigo-400/15',
    marker: 'bg-indigo-300',
  },
  {
    to: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['Admin', 'Technician'],
    active: 'bg-amber-400/10 text-amber-200 ring-1 ring-inset ring-amber-400/15',
    marker: 'bg-amber-300',
  },
  {
    to: '/observations', label: 'Observations', icon: Target, roles: ['Admin', 'Observer'],
    active: 'bg-fuchsia-400/10 text-fuchsia-200 ring-1 ring-inset ring-fuchsia-400/15',
    marker: 'bg-fuchsia-300',
  },
  {
    to: '/weather', label: 'Weather', icon: CloudSun, roles: ['Admin', 'Technician', 'Observer'],
    active: 'bg-cyan-400/10 text-cyan-200 ring-1 ring-inset ring-cyan-400/15',
    marker: 'bg-cyan-300',
  },
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
      className={`relative z-20 flex h-screen flex-shrink-0 flex-col overflow-hidden border-r border-white/[0.055] bg-[#080b13]/95 text-slate-200 shadow-[12px_0_45px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-[width] duration-300 ease-out ${
        collapsed ? 'w-[76px]' : 'w-64'
      }`}
    >
      <div className="pointer-events-none absolute -left-24 -top-16 h-72 w-72 rounded-full bg-violet-600/10 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-20 right-[-70px] h-56 w-56 rounded-full bg-cyan-400/[0.055] blur-[90px]" />

      <div className={`relative flex items-center ${collapsed ? 'justify-center px-3' : 'gap-3 px-5'} py-5`}>
        <BrandMark size={42} className="flex-shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display text-[17px] font-semibold leading-tight tracking-[-0.035em] text-white">AstroWatch</p>
            <p className="mt-1 truncate text-[9px] font-bold uppercase tracking-[0.18em] text-slate-600">Observatory Operations</p>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="relative mx-4 mb-5 rounded-2xl border border-emerald-300/[0.08] bg-emerald-400/[0.035] px-3 py-2.5">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-200/75">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-35" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Operations console online
          </div>
        </div>
      )}

      <nav className="relative flex-1 space-y-1.5 px-3">
        {!collapsed && <p className="mb-2.5 px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-700">Workspace</p>}
        {visibleItems.map(({ to, label, icon: Icon, active, marker }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive ? active : 'text-slate-500 hover:bg-white/[0.045] hover:text-slate-200'
              }`
            }
            title={collapsed ? label : undefined}
          >
            {({ isActive }) => (
              <>
                {isActive && <span className={`absolute inset-y-2 left-0 w-0.5 rounded-r-full ${marker}`} />}
                <Icon size={18} className="relative flex-shrink-0 transition-transform duration-200 group-hover:scale-105" strokeWidth={1.9} />
                {!collapsed && <span className="relative">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative border-t border-white/[0.055] px-3 py-4">
        {!collapsed && (
          <div className="mb-2.5 flex items-center gap-2.5 rounded-2xl border border-white/[0.05] bg-white/[0.025] px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-400/[0.08] text-violet-300 ring-1 ring-inset ring-violet-300/[0.08]">
              {user?.role === 'Admin' ? <ShieldCheck size={16} /> : <CircleUserRound size={16} />}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-slate-200">{user?.name}</p>
              <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-600">{user?.role}</p>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-white/[0.045] hover:text-slate-200"
            title={collapsed ? 'Expand sidebar' : undefined}
          >
            {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
            {!collapsed && <span>Collapse</span>}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-rose-400/[0.08] hover:text-rose-300"
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
