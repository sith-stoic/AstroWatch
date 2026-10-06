import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

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

  const fillDemo = (role) => {
    if (role === 'admin') setForm({ email: 'admin@astrowatch.com', password: 'admin123' });
    else setForm({ email: 'staff@astrowatch.com', password: 'staff123' });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600">
            <Star size={24} className="text-white" fill="currentColor" strokeWidth={1} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-white">AstroWatch</h1>
          <p className="mt-1 text-sm text-slate-400">Space Observatory Monitoring &amp; Management</p>
        </div>

        <div className="aw-card p-7">
          <h2 className="mb-1 text-lg font-semibold text-slate-900">Sign in</h2>
          <p className="mb-6 text-sm text-slate-500">Enter your credentials to access the observatory console.</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="aw-label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                className="aw-input"
                placeholder="you@astrowatch.com"
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
                  className="aw-input pr-10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="aw-error-text">{errors.password}</p>}
            </div>

            <button type="submit" className="aw-btn-primary w-full" disabled={submitting}>
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 rounded-lg bg-sky-50 p-3.5 text-xs text-slate-600">
            <p className="mb-1.5 font-medium text-slate-700">Demo credentials</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => fillDemo('admin')} className="rounded-md border border-sky-200 bg-white px-2.5 py-1 font-medium text-primary-700 hover:bg-sky-100">
                Use Admin
              </button>
              <button type="button" onClick={() => fillDemo('staff')} className="rounded-md border border-sky-200 bg-white px-2.5 py-1 font-medium text-primary-700 hover:bg-sky-100">
                Use Staff
              </button>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
