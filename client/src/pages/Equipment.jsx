import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Pencil, Trash2, Telescope, MapPin } from 'lucide-react';
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
    const timeout = setTimeout(fetchData, 300); // light debounce for search
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative w-full max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or location..."
              className="aw-input pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="aw-input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select className="aw-input w-auto" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">All types</option>
            {TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        {isAdmin && (
          <Link to="/equipment/add" className="aw-btn-primary">
            <Plus size={16} /> Add Equipment
          </Link>
        )}
      </div>

      <div className="aw-card overflow-hidden">
        {loading ? (
          <Loader label="Loading equipment..." />
        ) : items.length === 0 ? (
          <EmptyState
            icon={Telescope}
            title="No equipment found"
            message="Try adjusting your filters, or add a new item."
            action={isAdmin ? (
              <Link to="/equipment/add" className="aw-btn-primary">
                <Plus size={16} /> Add Equipment
              </Link>
            ) : null}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Location</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Condition</th>
                  {isAdmin && <th className="px-5 py-3 font-medium text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-3.5 font-medium text-slate-800">{item.name}</td>
                    <td className="px-5 py-3.5 text-slate-600">{item.type}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-slate-400" /> {item.location}
                      </span>
                    </td>
                    <td className="px-5 py-3.5"><StatusBadge value={item.status} /></td>
                    <td className="px-5 py-3.5"><StatusBadge value={item.condition} /></td>
                    {isAdmin && (
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/equipment/edit/${item._id}`}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-primary-600"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
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
        <ConfirmModal
          open={!!deleteTarget}
          title="Delete equipment?"
          message={`This will permanently remove "${deleteTarget?.name}". This action cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleting}
        />
      )}
    </div>
  );
}
