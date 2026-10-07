import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Pencil, Plus, Search, Telescope, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import equipmentService from '../services/equipmentService';
import StatusBadge from '../components/common/StatusBadge';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ConfirmModal from '../components/common/ConfirmModal';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['Operational', 'Warning', 'Offline', 'Maintenance'];
const TYPE_OPTIONS = [
  'Optical Telescope',
  'Radio Telescope',
  'CCD Camera',
  'Spectrograph',
  'Weather Sensor',
  'Tracking System',
];

export default function Equipment() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      const data = await equipmentService.getAll(params);
      setItems(data);
    } catch (error) {
      toast.error(error.message || 'Could not load equipment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchData, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, statusFilter, typeFilter]);

  const handleDelete = async () => {
    if (!deleteTarget || !isAdmin) return;
    setDeleting(true);
    try {
      await equipmentService.remove(deleteTarget._id);
      toast.success('Equipment deleted successfully');
      setDeleteTarget(null);
      fetchData();
    } catch (error) {
      toast.error(error.message || 'Could not delete equipment');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Asset registry</p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-[-0.02em] text-slate-900">Observatory equipment</h2>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">Track availability, physical condition, and location for every registered observatory asset.</p>
        </div>
        {isAdmin && (
          <Link to="/equipment/add" className="aw-btn-primary self-start sm:self-auto">
            <Plus size={16} /> Add Equipment
          </Link>
        )}
      </div>

      <div className="aw-card flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative w-full sm:max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Search by name or location..." className="aw-input pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="aw-input sm:w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="aw-input sm:w-auto" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All equipment types</option>
            {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="h-2 w-2 rounded-full bg-primary-400" />
          {loading ? 'Refreshing inventory...' : `${items.length} record${items.length === 1 ? '' : 's'} shown`}
        </div>
      </div>

      <div className="aw-card overflow-hidden">
        {loading ? (
          <Loader label="Loading equipment..." />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Telescope}
            title="No equipment found"
            message="Try adjusting your filters, or add a new item."
            action={isAdmin ? <Link to="/equipment/add" className="aw-btn-primary"><Plus size={16} /> Add Equipment</Link> : null}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200/80 bg-slate-50/80 text-[10px] uppercase tracking-[0.11em] text-slate-400">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Name</th>
                  <th className="px-5 py-3.5 font-bold">Type</th>
                  <th className="px-5 py-3.5 font-bold">Location</th>
                  <th className="px-5 py-3.5 font-bold">Status</th>
                  <th className="px-5 py-3.5 font-bold">Condition</th>
                  {isAdmin && <th className="px-5 py-3.5 text-right font-bold">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item._id} className="aw-table-row">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                          <Telescope size={16} />
                        </div>
                        <span className="font-semibold text-slate-800">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{item.type}</td>
                    <td className="px-5 py-4 text-slate-600"><span className="flex items-center gap-1.5"><MapPin size={13} className="text-slate-400" /> {item.location}</span></td>
                    <td className="px-5 py-4"><StatusBadge value={item.status} /></td>
                    <td className="px-5 py-4"><StatusBadge value={item.condition} /></td>
                    {isAdmin && (
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/equipment/edit/${item._id}`} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-primary-50 hover:text-primary-600" title="Edit"><Pencil size={15} /></Link>
                          <button type="button" onClick={() => setDeleteTarget(item)} className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600" title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAdmin && (
        <ConfirmModal open={!!deleteTarget} title="Delete equipment?" message={`This will permanently remove "${deleteTarget?.name}". This action cannot be undone.`} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />
      )}
    </div>
  );
}
