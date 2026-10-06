import { Link } from 'react-router-dom';
import { Telescope } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
        <Telescope size={26} className="text-primary-600" />
      </div>
      <div>
        <p className="font-display text-3xl font-semibold text-slate-900">404</p>
        <p className="mt-1 text-slate-500">This page drifted out of the observatory's field of view.</p>
      </div>
      <Link to="/dashboard" className="aw-btn-primary">Return to Dashboard</Link>
    </div>
  );
}
