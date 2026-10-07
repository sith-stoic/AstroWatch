import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Target, Clock, RefreshCw } from 'lucide-react';
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
      {isObserver && (
        <div className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-800">
          <strong>My assigned observations:</strong> only observations assigned to your Observer account are shown. You can update observation status and notes; scheduling and assignment are controlled by Admin.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder={isAdmin ? 'Search by target or observer...' : 'Search my observations...'} className="aw-input pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="aw-input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="aw-input w-auto" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All priorities</option>
            {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        {isAdmin && (
          <Link to="/observations/add" className="aw-btn-primary"><Plus size={16} /> Schedule Observation</Link>
        )}
      </div>

      <div className="aw-card overflow-hidden">
        {loading ? (
          <Loader label="Loading observations..." />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Target}
            title={isObserver ? 'No assigned observations' : 'No observations found'}
            message={isObserver ? 'There are currently no observations assigned to your account.' : 'Try adjusting your filters, or schedule a new observation.'}
            action={isAdmin ? <Link to="/observations/add" className="aw-btn-primary"><Plus size={16} /> Schedule Observation</Link> : null}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Target</th>
                  <th className="px-5 py-3 font-medium">Equipment</th>
                  <th className="px-5 py-3 font-medium">Date &amp; Time</th>
                  <th className="px-5 py-3 font-medium">Observer</th>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((obs) => (
                  <tr key={obs._id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-medium text-slate-800">{obs.target}</td>
                    <td className="px-5 py-3.5 text-slate-600">{obs.equipment?.name || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <span className="flex items-center gap-1.5"><Clock size={13} className="text-slate-400" />{formatDate(obs.date)} · {obs.startTime}–{obs.endTime}</span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">{obs.observer?.name || '—'}</td>
                    <td className="px-5 py-3.5"><StatusBadge value={obs.priority} /></td>
                    <td className="px-5 py-3.5"><StatusBadge value={obs.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/observations/edit/${obs._id}`} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-primary-600" title={isAdmin ? 'Edit observation' : 'Update status'}>
                          {isAdmin ? <Pencil size={15} /> : <RefreshCw size={15} />}
                        </Link>
                        {isAdmin && (
                          <button type="button" onClick={() => setDeleteTarget(obs)} className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 size={15} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAdmin && (
        <ConfirmModal open={!!deleteTarget} title="Delete observation?" message={`This will permanently remove the "${deleteTarget?.target}" observation. This action cannot be undone.`} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />
      )}
    </div>
  );
}
