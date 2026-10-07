import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck, Target, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import AuthVisual from '../components/common/AuthVisual';
import BrandMark from '../components/common/BrandMark';

const DEMO_ROLES = [
  {
    id: 'admin', label: 'Admin', icon: ShieldCheck, email: 'admin@astrowatch.com', password: 'admin123',
    classes: 'border-violet-400/20 bg-violet-500/[0.08] text-violet-200 hover:border-violet-400/45 hover:bg-violet-500/[0.14]',
    iconClasses: 'text-violet-300',
  },
  {
    id: 'technician', label: 'Technician', icon: Wrench, email: 'technician@astrowatch.com', password: 'tech123',
    classes: 'border-amber-400/20 bg-amber-500/[0.07] text-amber-200 hover:border-amber-400/45 hover:bg-amber-500/[0.13]',
    iconClasses: 'text-amber-300',
  },
  {
    id: 'observer', label: 'Observer', icon: Target, email: 'observer@astrowatch.com', password: 'observer123',
    classes: 'border-cyan-400/20 bg-cyan-500/[0.07] text-cyan-200 hover:border-cyan-400/45 hover:bg-cyan-500/[0.13]',
    iconClasses: 'text-cyan-300',
  },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Email is required';
    if (!form.password) next.password = 'Password is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(form.email.trim(), form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (roleId) => {
    const role = DEMO_ROLES.find((item) => item.id === roleId);
    if (role) setForm({ email: role.email, password: role.password });
    setErrors({});
  };

  return (
    <div className="aw-auth-shell flex min-h-screen">
      <AuthVisual eyebrow="Mission-ready operations" />

      <main className="aw-auth-panel relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute right-[-14%] top-[-12%] h-80 w-80 rounded-full bg-violet-500/10 blur-[95px]" />
        <div className="pointer-events-none absolute bottom-[-20%] left-[-8%] h-72 w-72 rounded-full bg-cyan-400/10 blur-[110px]" />

        <div className="aw-auth-enter relative z-10 w-full max-w-[470px]">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-3">
              <BrandMark size={48} />
              <div>
                <p className="font-display text-lg font-semibold tracking-[-0.035em] text-slate-50">AstroWatch</p>
                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">Observatory Operations</p>
              </div>
            </div>
          </div>

          <div className="mb-7">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="h-px w-7 bg-violet-500" />
              <p className="aw-auth-kicker">Secure access</p>
            </div>
            <h2 className="font-display text-[2rem] font-semibold tracking-[-0.045em] text-slate-50">Welcome back</h2>
            <p className="mt-2.5 text-sm leading-6 text-slate-400">Sign in to continue to your observatory operations workspace.</p>
          </div>

          <div className="aw-card p-6 sm:p-7">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <label className="aw-label" htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  className="aw-input"
                  placeholder="you@astrowatch.com"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <p className="aw-error-text">{errors.email}</p>}
              </div>

              <div>
                <label className="aw-label" htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="aw-input pr-11"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-500 transition-colors hover:bg-white/[0.06] hover:text-slate-200"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="aw-error-text">{errors.password}</p>}
              </div>

              <button type="submit" className="aw-btn-primary mt-2 w-full py-3" disabled={submitting}>
                {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                {submitting ? 'Signing in...' : 'Sign in to AstroWatch'}
                {!submitting && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-white/[0.09]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.19em] text-slate-500">Demo access</span>
              <span className="h-px flex-1 bg-white/[0.09]" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {DEMO_ROLES.map(({ id, label, icon: Icon, classes, iconClasses }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => fillDemo(id)}
                  className={`group flex flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-3 text-[10px] font-bold transition-all ${classes}`}
                >
                  <Icon size={16} className={iconClasses} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Need an operational account?{' '}
            <Link to="/register" className="font-bold text-violet-300 transition-colors hover:text-violet-200">Create one</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
