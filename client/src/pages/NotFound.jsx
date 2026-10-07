import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import BrandMark from '../components/common/BrandMark';

export default function NotFound() {
  return (
    <div className="aw-grid-pattern relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#060810] px-4 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.12] blur-[100px]" />
      <div className="pointer-events-none absolute left-[58%] top-[58%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/[0.06] blur-[110px]" />
      <div className="aw-auth-enter relative z-10">
        <BrandMark size={68} className="mx-auto" />
        <p className="mt-7 font-display text-5xl font-semibold tracking-[-0.06em] text-white">404</p>
        <h1 className="mt-2 font-display text-xl font-semibold text-slate-200">Outside the field of view</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">The page you requested is not part of the current AstroWatch operations console.</p>
        <Link to="/dashboard" className="aw-btn-primary mt-6">Return to Dashboard <ArrowRight size={15} /></Link>
      </div>
    </div>
  );
}
