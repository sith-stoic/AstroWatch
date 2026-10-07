import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck, Target, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import AuthVisual from '../components/common/AuthVisual';
import BrandMark from '../components/common/BrandMark';

const DEMO_ROLES = [
  { id: 'admin', label: 'Admin', icon: ShieldCheck, email: 'admin@astrowatch.com', password: 'admin123' },
  { id: 'technician', label: 'Technician', icon: Wrench, email: 'technician@astrowatch.com', password: 'tech123' },
  { id: 'observer', label: 'Observer', icon: Target, email: 'observer@astrowatch.com', password: 'observer123' },
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
    <div className="flex min-h-screen bg-slate-50">
      <AuthVisual eyebrow="Mission-ready operations" />

      <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute right-[-12%] top-[-12%] h-72 w-72 rounded-full bg-primary-100/70 blur-3xl" />
        <div className="aw-auth-enter relative z-10 w-full max-w-[470px]">
          <div className="mb-7 lg:hidden">
            <div className="flex items-center gap-3">
              <BrandMark size={44} />
              <div>
                <p className="font-display text-lg font-semibold text-slate-950">AstroWatch</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Observatory Operations</p>
              </div>
            </div>
          </div>

          <div className="mb-7">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600">Secure access</p>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.035em] text-slate-950">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Sign in to continue to your AstroWatch workspace.</p>
          </div>

          <div className="aw-card border-slate-200/70 p-6 sm:p-7">
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
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
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Demo access</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {DEMO_ROLES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => fillDemo(id)}
                  className="group flex flex-col items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2 py-3 text-[11px] font-semibold text-slate-600 transition-all hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
                >
                  <Icon size={16} className="text-slate-400 transition-colors group-hover:text-primary-600" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-slate-500">
            Need an operational account?{' '}
            <Link to="/register" className="font-semibold text-primary-600 transition-colors hover:text-primary-700">Create one</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
