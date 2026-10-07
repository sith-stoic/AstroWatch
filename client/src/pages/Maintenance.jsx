import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, RefreshCw, Search, Trash2, User, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import maintenanceService from '../services/maintenanceService';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['Scheduled', 'In Progress', 'Completed', 'Overdue'];
const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];
const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function Maintenance() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isTechnician = user?.role === 'Technician';
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
      setItems(await maintenanceService.getAll(params));
    } catch (error) {
      toast.error(error.message || 'Could not load maintenance tasks');
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
      await maintenanceService.remove(deleteTarget._id);
      toast.success('Maintenance task deleted successfully');
      setDeleteTarget(null);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Could not delete task');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Service operations</p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-[-0.02em] text-slate-900">{isTechnician ? 'My maintenance workload' : 'Maintenance schedule'}</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{isTechnician ? 'Review assigned service work and update progress as maintenance is performed.' : 'Plan service work, assign registered technicians, and track completion.'}</p>
        </div>
        {isAdmin && <Link to="/maintenance/add" className="aw-btn-primary self-start sm:self-auto"><Plus size={16} /> Add Task</Link>}
      </div>

      {isTechnician && (
        <div className="flex items-start gap-3 rounded-2xl border border-cyan-200/80 bg-cyan-50/70 px-4 py-3.5 text-sm text-cyan-900">
          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-white text-cyan-600 shadow-sm"><Wrench size={15} /></div>
          <div><p className="font-semibold">Assigned maintenance only</p><p className="mt-0.5 text-xs leading-5 text-cyan-800/80">Task details and assignment are controlled by Admin. You can update status and work notes for tasks assigned to your account.</p></div>
        </div>
      )}

      <div className="aw-card flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative w-full sm:max-w-sm"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder={isAdmin ? 'Search by title or technician...' : 'Search my tasks...'} className="aw-input pl-9" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <select className="aw-input sm:w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="">All statuses</option>{STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}</select>
          <select className="aw-input sm:w-auto" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}><option value="">All priorities</option>{PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}</select>
        </div>
        <div className="text-xs text-slate-400">{loading ? 'Refreshing...' : `${items.length} task${items.length === 1 ? '' : 's'} shown`}</div>
      </div>

      <div className="aw-card overflow-hidden">
        {loading ? <Loader label="Loading maintenance tasks..." /> : items.length === 0 ? (
          <EmptyState icon={Wrench} title={isTechnician ? 'No assigned maintenance tasks' : 'No maintenance tasks found'} message={isTechnician ? 'There are currently no maintenance tasks assigned to your account.' : 'Try adjusting your filters, or schedule a new task.'} action={isAdmin ? <Link to="/maintenance/add" className="aw-btn-primary"><Plus size={16} /> Add Task</Link> : null} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] uppercase tracking-[0.11em] text-slate-400"><tr><th className="px-5 py-3.5 font-bold">Task</th><th className="px-5 py-3.5 font-bold">Equipment</th><th className="px-5 py-3.5 font-bold">Scheduled</th><th className="px-5 py-3.5 font-bold">Technician</th><th className="px-5 py-3.5 font-bold">Priority</th><th className="px-5 py-3.5 font-bold">Status</th><th className="px-5 py-3.5 text-right font-bold">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((task) => (
                  <tr key={task._id} className="aw-table-row">
                    <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600"><Wrench size={16} /></div><span className="font-semibold text-slate-800">{task.title}</span></div></td>
                    <td className="px-5 py-4 text-slate-600">{task.equipment?.name || '—'}</td>
                    <td className="px-5 py-4 text-slate-600">{formatDate(task.scheduledDate)}</td>
                    <td className="px-5 py-4 text-slate-600"><span className="flex items-center gap-1.5"><User size={13} className="text-slate-400" /> {task.assignedTo?.name || '—'}</span></td>
                    <td className="px-5 py-4"><StatusBadge value={task.priority} /></td><td className="px-5 py-4"><StatusBadge value={task.status} /></td>
                    <td className="px-5 py-4"><div className="flex items-center justify-end gap-1"><Link to={`/maintenance/edit/${task._id}`} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary-600" title={isAdmin ? 'Edit task' : 'Update status'}>{isAdmin ? <Pencil size={15} /> : <RefreshCw size={15} />}</Link>{isAdmin && <button type="button" onClick={() => setDeleteTarget(task)} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 size={15} /></button>}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAdmin && <ConfirmModal open={!!deleteTarget} title="Delete maintenance task?" message={`This will permanently remove "${deleteTarget?.title}". This action cannot be undone.`} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />}
    </div>
  );
}
