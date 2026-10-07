import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Loader2, Target, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import AuthVisual from '../components/common/AuthVisual';
import BrandMark from '../components/common/BrandMark';

const ROLE_OPTIONS = [
  {
    role: 'Technician',
    title: 'Technician',
    description: 'Handle assigned maintenance work and update equipment service progress.',
    icon: Wrench,
  },
  {
    role: 'Observer',
    title: 'Observer',
    description: 'Handle assigned observing sessions and update observation progress.',
    icon: Target,
  },
];

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
  const [showPasswords, setShowPasswords] = useState(false);

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
    <div className="flex min-h-screen bg-slate-50">
      <AuthVisual eyebrow="Join the operations team" />

      <main className="relative flex min-h-screen flex-1 items-center justify-center overflow-hidden px-5 py-10 sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute right-[-12%] top-[-12%] h-72 w-72 rounded-full bg-violet-100/60 blur-3xl" />
        <div className="aw-auth-enter relative z-10 w-full max-w-[560px]">
          <div className="mb-6 lg:hidden">
            <div className="flex items-center gap-3">
              <BrandMark size={44} />
              <div>
                <p className="font-display text-lg font-semibold text-slate-950">AstroWatch</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400">Observatory Operations</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary-600">Operational access</p>
            <h2 className="font-display text-3xl font-semibold tracking-[-0.035em] text-slate-950">Create your workspace account</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Choose the role that matches your responsibility inside the observatory.</p>
          </div>

          <div className="aw-card border-slate-200/70 p-6 sm:p-7">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="aw-label" htmlFor="name">Full name</label>
                  <input id="name" type="text" className="aw-input" placeholder="Arjun Mehta" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  {errors.name && <p className="aw-error-text">{errors.name}</p>}
                </div>
                <div>
                  <label className="aw-label" htmlFor="email">Email address</label>
                  <input id="email" type="email" className="aw-input" placeholder="you@astrowatch.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  {errors.email && <p className="aw-error-text">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="aw-label">Operational role</label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {ROLE_OPTIONS.map(({ role, title, description, icon: Icon }) => {
                    const active = form.role === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setForm({ ...form, role })}
                        className={`relative rounded-xl border p-4 text-left transition-all duration-200 ${
                          active
                            ? 'border-primary-300 bg-primary-50 ring-2 ring-primary-100'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${active ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                            <Icon size={17} />
                          </span>
                          <div>
                            <p className={`text-sm font-semibold ${active ? 'text-primary-800' : 'text-slate-800'}`}>{title}</p>
                            <p className="mt-1 text-[11px] leading-4 text-slate-500">{description}</p>
                          </div>
                        </div>
                        <span className={`absolute right-3 top-3 h-2 w-2 rounded-full ${active ? 'bg-primary-500' : 'bg-slate-200'}`} />
                      </button>
                    );
                  })}
                </div>
                {errors.role && <p className="aw-error-text">{errors.role}</p>}
                <p className="mt-2 text-[11px] text-slate-400">Administrator access is provisioned separately and cannot be created through public registration.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="aw-label" htmlFor="password">Password</label>
                  <div className="relative">
                    <input id="password" type={showPasswords ? 'text' : 'password'} className="aw-input pr-10" placeholder="Minimum 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <button type="button" onClick={() => setShowPasswords((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" tabIndex={-1}>
                      {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                  {errors.password && <p className="aw-error-text">{errors.password}</p>}
                </div>
                <div>
                  <label className="aw-label" htmlFor="confirmPassword">Confirm password</label>
                  <input id="confirmPassword" type={showPasswords ? 'text' : 'password'} className="aw-input" placeholder="Repeat password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                  {errors.confirmPassword && <p className="aw-error-text">{errors.confirmPassword}</p>}
                </div>
              </div>

              <button type="submit" className="aw-btn-primary mt-1 w-full py-3" disabled={submitting}>
                {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                {submitting ? 'Creating account...' : `Create ${form.role} Account`}
                {!submitting && <ArrowRight size={16} />}
              </button>
            </form>
          </div>

          <p className="mt-5 text-center text-sm text-slate-500">
            Already have access?{' '}
            <Link to="/login" className="font-semibold text-primary-600 transition-colors hover:text-primary-700">Sign in</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
