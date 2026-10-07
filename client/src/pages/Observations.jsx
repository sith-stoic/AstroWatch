import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Pencil, Plus, RefreshCw, Search, Target, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import observationService from '../services/observationService';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function Observations() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isObserver = user?.role === 'Observer';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      setItems(await observationService.getAll(params));
    } catch (error) {
      toast.error(error.message || 'Could not load observations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchData, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, priorityFilter]);

  const handleDelete = async () => {
    if (!deleteTarget || !isAdmin) return;
    setDeleting(true);
    try {
      await observationService.remove(deleteTarget._id);
      toast.success('Observation deleted successfully');
      setDeleteTarget(null);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Could not delete observation');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Observation planning</p><h2 className="mt-1 font-display text-xl font-semibold tracking-[-0.02em] text-slate-900">{isObserver ? 'My observing sessions' : 'Observation schedule'}</h2><p className="mt-1 max-w-2xl text-sm text-slate-500">{isObserver ? 'Review sessions assigned to your account and update observation progress.' : 'Coordinate targets, equipment availability, observers, and observing windows.'}</p></div>
        {isAdmin && <Link to="/observations/add" className="aw-btn-primary self-start sm:self-auto"><Plus size={16} /> Schedule Observation</Link>}
      </div>

      {isObserver && (
        <div className="flex items-start gap-3 rounded-2xl border border-violet-200/80 bg-violet-50/70 px-4 py-3.5 text-sm text-violet-900">
          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-violet-600 shadow-sm"><Target size={15} /></div>
          <div><p className="font-semibold">Assigned observations only</p><p className="mt-0.5 text-xs leading-5 text-violet-800/80">Scheduling and assignment are controlled by Admin. You can update status and notes for sessions assigned to your account.</p></div>
        </div>
      )}

      <div className="aw-card flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative w-full sm:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder={isAdmin ? 'Search by target or observer...' : 'Search my observations...'} className="aw-input pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <select className="aw-input sm:w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">All statuses</option>{STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}</select>
          <select className="aw-input sm:w-auto" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}><option value="">All priorities</option>{PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}</select>
        </div>
        <div className="text-xs text-slate-400">{loading ? 'Refreshing...' : `${items.length} session${items.length === 1 ? '' : 's'} shown`}</div>
      </div>

      <div className="aw-card overflow-hidden">
        {loading ? <Loader label="Loading observations..." /> : items.length === 0 ? (
          <EmptyState icon={Target} title={isObserver ? 'No assigned observations' : 'No observations found'} message={isObserver ? 'There are currently no observations assigned to your account.' : 'Try adjusting your filters, or schedule a new observation.'} action={isAdmin ? <Link to="/observations/add" className="aw-btn-primary"><Plus size={16} /> Schedule Observation</Link> : null} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] uppercase tracking-[0.11em] text-slate-400"><tr><th className="px-5 py-3.5 font-bold">Target</th><th className="px-5 py-3.5 font-bold">Equipment</th><th className="px-5 py-3.5 font-bold">Date &amp; Time</th><th className="px-5 py-3.5 font-bold">Observer</th><th className="px-5 py-3.5 font-bold">Priority</th><th className="px-5 py-3.5 font-bold">Status</th><th className="px-5 py-3.5 text-right font-bold">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((obs) => (
                  <tr key={obs._id} className="aw-table-row">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600"><Target size={16} /></div><span className="font-semibold text-slate-800">{obs.target}</span></div></td>
                    <td className="px-5 py-4 text-slate-600">{obs.equipment?.name || '—'}</td>
                    <td className="px-5 py-4 text-slate-600"><span className="flex items-center gap-1.5 whitespace-nowrap"><Clock size={13} className="text-slate-400" />{formatDate(obs.date)} · {obs.startTime}–{obs.endTime}</span></td>
                    <td className="px-5 py-4 text-slate-600">{obs.observer?.name || '—'}</td><td className="px-5 py-4"><StatusBadge value={obs.priority} /></td><td className="px-5 py-4"><StatusBadge value={obs.status} /></td>
                    <td className="px-5 py-4"><div className="flex items-center justify-end gap-1"><Link to={`/observations/edit/${obs._id}`} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary-600" title={isAdmin ? 'Edit observation' : 'Update status'}>{isAdmin ? <Pencil size={15} /> : <RefreshCw size={15} />}</Link>{isAdmin && <button type="button" onClick={() => setDeleteTarget(obs)} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 size={15} /></button>}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAdmin && <ConfirmModal open={!!deleteTarget} title="Delete observation?" message={`This will permanently remove the "${deleteTarget?.target}" observation. This action cannot be undone.`} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />}
    </div>
  );
}
