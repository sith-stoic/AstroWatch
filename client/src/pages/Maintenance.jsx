import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Wrench, User, RefreshCw } from 'lucide-react';
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
      {isTechnician && (
        <div className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800">
          <strong>My assigned maintenance:</strong> only tasks assigned to your Technician account are shown. You can update task status and notes; task details and assignment are controlled by Admin.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder={isAdmin ? 'Search by title or technician...' : 'Search my tasks...'} className="aw-input pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
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
          <Link to="/maintenance/add" className="aw-btn-primary">
            <Plus size={16} /> Add Task
          </Link>
        )}
      </div>

      <div className="aw-card overflow-hidden">
        {loading ? (
          <Loader label="Loading maintenance tasks..." />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Wrench}
            title={isTechnician ? 'No assigned maintenance tasks' : 'No maintenance tasks found'}
            message={isTechnician ? 'There are currently no maintenance tasks assigned to your account.' : 'Try adjusting your filters, or schedule a new task.'}
            action={isAdmin ? <Link to="/maintenance/add" className="aw-btn-primary"><Plus size={16} /> Add Task</Link> : null}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Task</th>
                  <th className="px-5 py-3 font-medium">Equipment</th>
                  <th className="px-5 py-3 font-medium">Scheduled</th>
                  <th className="px-5 py-3 font-medium">Technician</th>
                  <th className="px-5 py-3 font-medium">Priority</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((task) => (
                  <tr key={task._id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-medium text-slate-800">{task.title}</td>
                    <td className="px-5 py-3.5 text-slate-600">{task.equipment?.name || '—'}</td>
                    <td className="px-5 py-3.5 text-slate-600">{formatDate(task.scheduledDate)}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <span className="flex items-center gap-1.5"><User size={13} className="text-slate-400" /> {task.assignedTo?.name || '—'}</span>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge value={task.priority} /></td>
                    <td className="px-5 py-3.5"><StatusBadge value={task.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/maintenance/edit/${task._id}`} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-primary-600" title={isAdmin ? 'Edit task' : 'Update status'}>
                          {isAdmin ? <Pencil size={15} /> : <RefreshCw size={15} />}
                        </Link>
                        {isAdmin && (
                          <button type="button" onClick={() => setDeleteTarget(task)} className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600" title="Delete">
                            <Trash2 size={15} />
                          </button>
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
        <ConfirmModal open={!!deleteTarget} title="Delete maintenance task?" message={`This will permanently remove "${deleteTarget?.title}". This action cannot be undone.`} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />
      )}
    </div>
  );
}
