import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import maintenanceService from '../services/maintenanceService';
import equipmentService from '../services/equipmentService';
import Loader from '../components/common/Loader';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];
const STATUS_OPTIONS = ['Scheduled', 'In Progress', 'Completed', 'Overdue'];

const emptyForm = {
  equipment: '',
  title: '',
  description: '',
  scheduledDate: '',
  assignedTo: '',
  priority: 'Medium',
  status: 'Scheduled',
  notes: '',
};

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

export default function MaintenanceForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const equipmentList = await equipmentService.getAll();
        setEquipmentOptions(equipmentList);

        if (isEdit) {
          const data = await maintenanceService.getById(id);
          setForm({
            equipment: data.equipment?._id || data.equipment,
            title: data.title,
            description: data.description || '',
            scheduledDate: toDateInput(data.scheduledDate),
            assignedTo: data.assignedTo,
            priority: data.priority,
            status: data.status,
            notes: data.notes || '',
          });
        } else if (equipmentList.length) {
          setForm((f) => ({ ...f, equipment: equipmentList[0]._id }));
        }
      } catch (error) {
        toast.error(error.message || 'Could not load maintenance task');
        navigate('/maintenance');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit, navigate]);

  const validate = () => {
    const next = {};
    if (!form.equipment) next.equipment = 'Equipment is required';
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.scheduledDate) next.scheduledDate = 'Scheduled date is required';
    if (!form.assignedTo.trim()) next.assignedTo = 'Assigned technician is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      if (isEdit) {
        await maintenanceService.update(id, form);
        toast.success('Maintenance task updated successfully');
      } else {
        await maintenanceService.create(form);
        toast.success('Maintenance task added successfully');
      }
      navigate('/maintenance');
    } catch (error) {
      toast.error(error.message || 'Could not save maintenance task');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading maintenance form..." />;

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/maintenance" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft size={15} /> Back to Maintenance
      </Link>

      <div className="aw-card p-6">
        <h2 className="mb-1 text-lg font-semibold text-slate-900">{isEdit ? 'Edit Maintenance Task' : 'Add Maintenance Task'}</h2>
        <p className="mb-6 text-sm text-slate-500">
          {isEdit ? 'Update the details for this task.' : 'Schedule a new maintenance task for a piece of equipment.'}
        </p>

        {equipmentOptions.length === 0 ? (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            No equipment found. Please add equipment first before scheduling maintenance.
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="aw-label" htmlFor="title">Title</label>
                <input
                  id="title"
                  type="text"
                  className="aw-input"
                  placeholder="Motor calibration and alignment check"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                {errors.title && <p className="aw-error-text">{errors.title}</p>}
              </div>

              <div>
                <label className="aw-label" htmlFor="equipment">Equipment</label>
                <select
                  id="equipment"
                  className="aw-input"
                  value={form.equipment}
                  onChange={(e) => setForm({ ...form, equipment: e.target.value })}
                >
                  {equipmentOptions.map((eq) => (
                    <option key={eq._id} value={eq._id}>{eq.name} ({eq.type})</option>
                  ))}
                </select>
                {errors.equipment && <p className="aw-error-text">{errors.equipment}</p>}
              </div>

              <div>
                <label className="aw-label" htmlFor="scheduledDate">Scheduled Date</label>
                <input
                  id="scheduledDate"
                  type="date"
                  className="aw-input"
                  value={form.scheduledDate}
                  onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })}
                />
                {errors.scheduledDate && <p className="aw-error-text">{errors.scheduledDate}</p>}
              </div>

              <div>
                <label className="aw-label" htmlFor="assignedTo">Assigned To</label>
                <input
                  id="assignedTo"
                  type="text"
                  className="aw-input"
                  placeholder="Technician name"
                  value={form.assignedTo}
                  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                />
                {errors.assignedTo && <p className="aw-error-text">{errors.assignedTo}</p>}
              </div>

              <div>
                <label className="aw-label" htmlFor="priority">Priority</label>
                <select id="priority" className="aw-input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {isEdit && (
                <div>
                  <label className="aw-label" htmlFor="status">Status</label>
                  <select id="status" className="aw-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="aw-label" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows={2}
                  className="aw-input"
                  placeholder="What needs to be done..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="aw-label" htmlFor="notes">Notes</label>
                <textarea
                  id="notes"
                  rows={2}
                  className="aw-input"
                  placeholder="Additional notes..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="aw-btn-secondary" onClick={() => navigate('/maintenance')}>
                Cancel
              </button>
              <button type="submit" className="aw-btn-primary" disabled={submitting}>
                {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
                {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
