import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import equipmentService from '../services/equipmentService';
import Loader from '../components/common/Loader';

const TYPE_OPTIONS = [
  'Optical Telescope',
  'Radio Telescope',
  'CCD Camera',
  'Spectrograph',
  'Weather Sensor',
  'Tracking System',
];
const STATUS_OPTIONS = ['Operational', 'Warning', 'Offline', 'Maintenance'];
const CONDITION_OPTIONS = ['Excellent', 'Good', 'Fair', 'Poor'];

const emptyForm = {
  name: '',
  type: TYPE_OPTIONS[0],
  location: '',
  status: 'Operational',
  condition: 'Good',
  description: '',
  lastMaintenance: '',
  nextMaintenance: '',
};

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

export default function EquipmentForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const data = await equipmentService.getById(id);
        setForm({
          name: data.name,
          type: data.type,
          location: data.location,
          status: data.status,
          condition: data.condition,
          description: data.description || '',
          lastMaintenance: toDateInput(data.lastMaintenance),
          nextMaintenance: toDateInput(data.nextMaintenance),
        });
      } catch (error) {
        toast.error(error.message || 'Could not load equipment');
        navigate('/equipment');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit, navigate]);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!form.location.trim()) next.location = 'Location is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        ...form,
        lastMaintenance: form.lastMaintenance || null,
        nextMaintenance: form.nextMaintenance || null,
      };
      if (isEdit) {
        await equipmentService.update(id, payload);
        toast.success('Equipment updated successfully');
      } else {
        await equipmentService.create(payload);
        toast.success('Equipment added successfully');
      }
      navigate('/equipment');
    } catch (error) {
      toast.error(error.message || 'Could not save equipment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading equipment..." />;

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/equipment" className="aw-back-link">
        <ArrowLeft size={15} /> Back to Equipment
      </Link>

      <div className="aw-card overflow-hidden p-6 sm:p-7">
        <h2 className="mb-1 text-lg font-semibold text-slate-900">{isEdit ? 'Edit Equipment' : 'Add Equipment'}</h2>
        <p className="mb-6 text-sm text-slate-500">
          {isEdit ? 'Update the details for this equipment item.' : 'Register a new equipment item in the observatory inventory.'}
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="aw-label" htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                className="aw-input"
                placeholder="Telescope-01"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              {errors.name && <p className="aw-error-text">{errors.name}</p>}
            </div>

            <div>
              <label className="aw-label" htmlFor="type">Type</label>
              <select id="type" className="aw-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="aw-label" htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                className="aw-input"
                placeholder="Main Observatory Dome"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              {errors.location && <p className="aw-error-text">{errors.location}</p>}
            </div>

            <div>
              <label className="aw-label" htmlFor="status">Status</label>
              <select id="status" className="aw-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="aw-label" htmlFor="condition">Condition</label>
              <select id="condition" className="aw-input" value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}>
                {CONDITION_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="aw-label" htmlFor="lastMaintenance">Last Maintenance</label>
              <input
                id="lastMaintenance"
                type="date"
                className="aw-input"
                value={form.lastMaintenance}
                onChange={(e) => setForm({ ...form, lastMaintenance: e.target.value })}
              />
            </div>

            <div>
              <label className="aw-label" htmlFor="nextMaintenance">Next Maintenance</label>
              <input
                id="nextMaintenance"
                type="date"
                className="aw-input"
                value={form.nextMaintenance}
                onChange={(e) => setForm({ ...form, nextMaintenance: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="aw-label" htmlFor="description">Description</label>
              <textarea
                id="description"
                rows={3}
                className="aw-input"
                placeholder="Brief notes about this equipment..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="aw-btn-secondary" onClick={() => navigate('/equipment')}>
              Cancel
            </button>
            <button type="submit" className="aw-btn-primary" disabled={submitting}>
              {submitting ? <Loader2 size={16} className="animate-spin" /> : null}
              {submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Equipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
