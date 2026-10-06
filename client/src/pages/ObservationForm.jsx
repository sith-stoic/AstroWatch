import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import observationService from '../services/observationService';
import equipmentService from '../services/equipmentService';
import Loader from '../components/common/Loader';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const STATUS_OPTIONS = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

const emptyForm = {
  target: '',
  description: '',
  date: '',
  startTime: '',
  endTime: '',
  equipment: '',
  observer: '',
  priority: 'Medium',
  status: 'Scheduled',
  notes: '',
};

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

export default function ObservationForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // Cross-module validation feedback shown as an inline banner - this is the
  // most important UX moment in the project, so it isn't left to a toast alone.
  const [conflictMessage, setConflictMessage] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const equipmentList = await equipmentService.getAll();
        setEquipmentOptions(equipmentList);

        if (isEdit) {
          const data = await observationService.getById(id);
          setForm({
            target: data.target,
            description: data.description || '',
            date: toDateInput(data.date),
            startTime: data.startTime,
            endTime: data.endTime,
            equipment: data.equipment?._id || data.equipment,
            observer: data.observer,
            priority: data.priority,
            status: data.status,
            notes: data.notes || '',
          });
        } else if (equipmentList.length) {
          setForm((f) => ({ ...f, equipment: equipmentList[0]._id }));
        }
      } catch (error) {
        toast.error(error.message || 'Could not load observation');
        navigate('/observations');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit, navigate]);

  const validate = () => {
    const next = {};
    if (!form.target.trim()) next.target = 'Target is required';
    if (!form.date) next.date = 'Date is required';
    if (!form.startTime) next.startTime = 'Start time is required';
    if (!form.endTime) next.endTime = 'End time is required';
    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      next.endTime = 'End time must be after start time';
    }
    if (!form.equipment) next.equipment = 'Equipment is required';
    if (!form.observer.trim()) next.observer = 'Observer name is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConflictMessage(null);
    setWarningMessage(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const response = isEdit
        ? await observationService.update(id, form)
        : await observationService.create(form);

      toast.success(response.message || 'Observation saved successfully');
      if (response.warning) {
        setWarningMessage(response.warning);
        toast(response.warning, { icon: '⚠️' });
        // Give the user a moment to see the warning before navigating away
        setTimeout(() => navigate('/observations'), 1600);
      } else {
        navigate('/observations');
      }
    } catch (error) {
      // Conflict / validation errors from the backend (equipment status,
      // maintenance clash, time overlap) are shown as a prominent banner.
      setConflictMessage(error.message || 'Could not save observation');
      toast.error(error.message || 'Could not save observation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading observation form..." />;

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/observations" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft size={15} /> Back to Observations
      </Link>

      <div className="aw-card p-6">
        <h2 className="mb-1 text-lg font-semibold text-slate-900">{isEdit ? 'Edit Observation' : 'Schedule Observation'}</h2>
        <p className="mb-6 text-sm text-slate-500">
          {isEdit
            ? 'Update the details for this observation.'
            : 'AstroWatch will check equipment availability, maintenance conflicts, and scheduling overlaps automatically.'}
        </p>

        {conflictMessage && (
          <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
            <AlertTriangle size={17} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Scheduling conflict</p>
              <p className="mt-0.5">{conflictMessage}</p>
            </div>
          </div>
        )}

        {warningMessage && (
          <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-700">
            <AlertTriangle size={17} className="mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Scheduled with a warning</p>
              <p className="mt-0.5">{warningMessage}</p>
            </div>
          </div>
        )}

        {equipmentOptions.length === 0 ? (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            No equipment found. Please add equipment first before scheduling an observation.
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="aw-label" htmlFor="target">Target</label>
                <input
                  id="target"
                  type="text"
                  className="aw-input"
                  placeholder="Jupiter"
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value })}
                />
                {errors.target && <p className="aw-error-text">{errors.target}</p>}
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
                    <option key={eq._id} value={eq._id}>{eq.name} — {eq.status}</option>
                  ))}
                </select>
                {errors.equipment && <p className="aw-error-text">{errors.equipment}</p>}
              </div>

              <div>
                <label className="aw-label" htmlFor="observer">Observer</label>
                <input
                  id="observer"
                  type="text"
                  className="aw-input"
                  placeholder="Dr. Ananya Rao"
                  value={form.observer}
                  onChange={(e) => setForm({ ...form, observer: e.target.value })}
                />
                {errors.observer && <p className="aw-error-text">{errors.observer}</p>}
              </div>

              <div>
                <label className="aw-label" htmlFor="date">Date</label>
                <input
                  id="date"
                  type="date"
                  className="aw-input"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
                {errors.date && <p className="aw-error-text">{errors.date}</p>}
              </div>

              <div>
                <label className="aw-label" htmlFor="priority">Priority</label>
                <select id="priority" className="aw-input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="aw-label" htmlFor="startTime">Start Time</label>
                <input
                  id="startTime"
                  type="time"
                  className="aw-input"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                />
                {errors.startTime && <p className="aw-error-text">{errors.startTime}</p>}
              </div>

              <div>
                <label className="aw-label" htmlFor="endTime">End Time</label>
                <input
                  id="endTime"
                  type="time"
                  className="aw-input"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                />
                {errors.endTime && <p className="aw-error-text">{errors.endTime}</p>}
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
                  placeholder="What will be observed..."
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
              <button type="button" className="aw-btn-secondary" onClick={() => navigate('/observations')}>
                Cancel
              </button>
              <button type="submit" className="aw-btn-primary" disabled={submitting}>
                {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                {submitting ? 'Checking availability...' : isEdit ? 'Save Changes' : 'Schedule Observation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
