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
  Star,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/equipment', label: 'Equipment', icon: Telescope },
  { to: '/maintenance', label: 'Maintenance', icon: Wrench },
  { to: '/observations', label: 'Observations', icon: Target },
  { to: '/weather', label: 'Weather', icon: CloudSun },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside
      className={`flex h-screen flex-col bg-navy-900 text-slate-200 transition-all duration-200 ${
        collapsed ? 'w-[76px]' : 'w-64'
      }`}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary-600">
          <Star size={18} className="text-white" fill="currentColor" strokeWidth={1} />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display text-base font-semibold leading-tight text-white">AstroWatch</p>
            <p className="truncate text-[11px] text-slate-400">Observatory Management</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="mt-2 flex-1 space-y-1 px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-300 hover:bg-navy-800 hover:text-white'
              }`
            }
            title={collapsed ? label : undefined}
          >
            <Icon size={18} className="flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer: collapse toggle + logout */}
      <div className="space-y-1 border-t border-navy-800 px-3 py-4">
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-navy-800 hover:text-white"
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
