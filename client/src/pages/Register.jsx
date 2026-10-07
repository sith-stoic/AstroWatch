import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Telescope, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Technician',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    if (!['Technician', 'Observer'].includes(form.role)) next.role = 'Select a valid role';
    if (!form.password) next.password = 'Password is required';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters';
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      });
      toast.success(`${form.role} account created successfully`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Could not create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-600">
            <Telescope size={26} className="text-white" strokeWidth={1.8} />
          </div>
          <h1 className="font-display text-2xl font-semibold text-white">AstroWatch</h1>
          <p className="mt-1 text-sm text-slate-400">Create an observatory operations account</p>
        </div>

        <div className="aw-card p-7">
          <h2 className="mb-1 text-lg font-semibold text-slate-900">Create account</h2>
          <p className="mb-6 text-sm text-slate-500">Choose the operational role that matches your work.</p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="aw-label" htmlFor="name">Full name</label>
              <input id="name" type="text" className="aw-input" placeholder="Arjun Mehta" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {errors.name && <p className="aw-error-text">{errors.name}</p>}
            </div>

            <div>
              <label className="aw-label" htmlFor="email">Email</label>
              <input id="email" type="email" className="aw-input" placeholder="you@astrowatch.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              {errors.email && <p className="aw-error-text">{errors.email}</p>}
            </div>

            <div>
              <label className="aw-label" htmlFor="role">Role</label>
              <select id="role" className="aw-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="Technician">Technical Staff / Technician</option>
                <option value="Observer">Observer</option>
              </select>
              {errors.role && <p className="aw-error-text">{errors.role}</p>}
              <p className="mt-1 text-xs text-slate-400">Admin accounts cannot be created from public registration.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="aw-label" htmlFor="password">Password</label>
                <input id="password" type="password" className="aw-input" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                {errors.password && <p className="aw-error-text">{errors.password}</p>}
              </div>
              <div>
                <label className="aw-label" htmlFor="confirmPassword">Confirm</label>
                <input id="confirmPassword" type="password" className="aw-input" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                {errors.confirmPassword && <p className="aw-error-text">{errors.confirmPassword}</p>}
              </div>
            </div>

            <button type="submit" className="aw-btn-primary w-full" disabled={submitting}>
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {submitting ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
