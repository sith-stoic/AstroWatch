import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertTriangle, CheckCircle2, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import observationService from '../services/observationService';
import equipmentService from '../services/equipmentService';
import userService from '../services/userService';
import Loader from '../components/common/Loader';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High'];
const ADMIN_STATUS_OPTIONS = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
const OBSERVER_STATUS_OPTIONS = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

const emptyForm = {
  target: '', description: '', date: '', startTime: '', endTime: '', equipment: '', observer: '', priority: 'Medium', status: 'Scheduled', notes: '',
};
const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

export default function ObservationForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [form, setForm] = useState(emptyForm);
  const [observationDetails, setObservationDetails] = useState(null);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [observers, setObservers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [conflictMessage, setConflictMessage] = useState(null);
  const [warningMessage, setWarningMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!isAdmin) {
          const data = await observationService.getById(id);
          setObservationDetails(data);
          setForm({ ...emptyForm, status: data.status, notes: data.notes || '' });
          return;
        }

        const [equipmentList, observerList] = await Promise.all([
          equipmentService.getAll(),
          userService.getObservers(),
        ]);
        setEquipmentOptions(equipmentList);
        setObservers(observerList);

        if (isEdit) {
          const data = await observationService.getById(id);
          setObservationDetails(data);
          setForm({
            target: data.target,
            description: data.description || '',
            date: toDateInput(data.date),
            startTime: data.startTime,
            endTime: data.endTime,
            equipment: data.equipment?._id || data.equipment,
            observer: data.observer?._id || '',
            priority: data.priority,
            status: data.status,
            notes: data.notes || '',
          });
        } else {
          setForm((f) => ({ ...f, equipment: equipmentList[0]?._id || '', observer: observerList[0]?._id || '' }));
        }
      } catch (error) {
        toast.error(error.message || 'Could not load observation');
        navigate('/observations');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit, isAdmin, navigate]);

  const validate = () => {
    if (!isAdmin) return true;
    const next = {};
    if (!form.target.trim()) next.target = 'Target is required';
    if (!form.date) next.date = 'Date is required';
    if (!form.startTime) next.startTime = 'Start time is required';
    if (!form.endTime) next.endTime = 'End time is required';
    if (form.startTime && form.endTime && form.startTime >= form.endTime) next.endTime = 'End time must be after start time';
    if (!form.equipment) next.equipment = 'Equipment is required';
    if (!form.observer) next.observer = 'Assigned observer is required';
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
      if (!isAdmin) {
        const response = await observationService.update(id, { status: form.status, notes: form.notes });
        toast.success(response.message || 'Observation status updated');
        navigate('/observations');
        return;
      }

      const response = isEdit
        ? await observationService.update(id, form)
        : await observationService.create(form);

      toast.success(response.message || 'Observation saved successfully');
      if (response.warning) {
        setWarningMessage(response.warning);
        toast(response.warning, { icon: '⚠️' });
        setTimeout(() => navigate('/observations'), 1600);
      } else {
        navigate('/observations');
      }
    } catch (error) {
      if (isAdmin) setConflictMessage(error.message || 'Could not save observation');
      toast.error(error.message || 'Could not save observation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader label="Loading observation form..." />;

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-2xl">
        <Link to="/observations" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"><ArrowLeft size={15} /> Back to Observations</Link>
        <div className="aw-card p-6">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-lg bg-violet-50 p-2 text-violet-600"><Target size={20} /></div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Update Assigned Observation</h2>
              <p className="text-sm text-slate-500">You can update only the observation status and notes. Scheduling details are controlled by Admin.</p>
            </div>
          </div>

          <div className="mb-6 grid gap-3 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <div><span className="text-slate-400">Target</span><p className="font-medium text-slate-800">{observationDetails?.target}</p></div>
            <div><span className="text-slate-400">Equipment</span><p className="font-medium text-slate-800">{observationDetails?.equipment?.name}</p></div>
            <div><span className="text-slate-400">Time</span><p className="font-medium text-slate-800">{toDateInput(observationDetails?.date)} · {observationDetails?.startTime}–{observationDetails?.endTime}</p></div>
            <div><span className="text-slate-400">Priority</span><div className="mt-1"><StatusBadge value={observationDetails?.priority} /></div></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="aw-label" htmlFor="status">Observation Status</label>
              <select id="status" className="aw-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {OBSERVER_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="aw-label" htmlFor="notes">Observation Notes</label>
              <textarea id="notes" rows={4} className="aw-input" placeholder="Add progress or completion notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" className="aw-btn-secondary" onClick={() => navigate('/observations')}>Cancel</button>
              <button type="submit" className="aw-btn-primary" disabled={submitting}>{submitting ? <Loader2 size={16} className="animate-spin" /> : null}{submitting ? 'Updating...' : 'Update Observation'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const unavailable = equipmentOptions.length === 0 || observers.length === 0;
  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/observations" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700"><ArrowLeft size={15} /> Back to Observations</Link>
      <div className="aw-card p-6">
        <h2 className="mb-1 text-lg font-semibold text-slate-900">{isEdit ? 'Edit Observation' : 'Schedule Observation'}</h2>
        <p className="mb-6 text-sm text-slate-500">{isEdit ? 'Update observation details or assignment.' : 'Assign a registered Observer. AstroWatch checks equipment status, maintenance conflicts, and time overlaps automatically.'}</p>

        {conflictMessage && (
          <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
            <AlertTriangle size={17} className="mt-0.5 flex-shrink-0" /><div><p className="font-medium">Scheduling conflict</p><p className="mt-0.5">{conflictMessage}</p></div>
          </div>
        )}
        {warningMessage && (
          <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-700">
            <AlertTriangle size={17} className="mt-0.5 flex-shrink-0" /><div><p className="font-medium">Scheduled with a warning</p><p className="mt-0.5">{warningMessage}</p></div>
          </div>
        )}

        {unavailable ? (
          <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-700">
            {equipmentOptions.length === 0 ? 'Add equipment before scheduling an observation.' : 'No Observer accounts exist yet. Register an Observer account first.'}
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="aw-label" htmlFor="target">Target</label>
                <input id="target" type="text" className="aw-input" placeholder="Jupiter" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
                {errors.target && <p className="aw-error-text">{errors.target}</p>}
              </div>
              <div>
                <label className="aw-label" htmlFor="equipment">Equipment</label>
                <select id="equipment" className="aw-input" value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })}>
                  {equipmentOptions.map((eq) => <option key={eq._id} value={eq._id}>{eq.name} — {eq.status}</option>)}
                </select>
                {errors.equipment && <p className="aw-error-text">{errors.equipment}</p>}
              </div>
              <div>
                <label className="aw-label" htmlFor="observer">Assigned Observer</label>
                <select id="observer" className="aw-input" value={form.observer} onChange={(e) => setForm({ ...form, observer: e.target.value })}>
                  {observers.map((observer) => <option key={observer._id} value={observer._id}>{observer.name} — {observer.email}</option>)}
                </select>
                {errors.observer && <p className="aw-error-text">{errors.observer}</p>}
              </div>
              <div>
                <label className="aw-label" htmlFor="date">Date</label>
                <input id="date" type="date" className="aw-input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                {errors.date && <p className="aw-error-text">{errors.date}</p>}
              </div>
              <div>
                <label className="aw-label" htmlFor="priority">Priority</label>
                <select id="priority" className="aw-input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>{PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}</select>
              </div>
              <div>
                <label className="aw-label" htmlFor="startTime">Start Time</label>
                <input id="startTime" type="time" className="aw-input" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} />
                {errors.startTime && <p className="aw-error-text">{errors.startTime}</p>}
              </div>
              <div>
                <label className="aw-label" htmlFor="endTime">End Time</label>
                <input id="endTime" type="time" className="aw-input" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} />
                {errors.endTime && <p className="aw-error-text">{errors.endTime}</p>}
              </div>
              {isEdit && (
                <div>
                  <label className="aw-label" htmlFor="status">Status</label>
                  <select id="status" className="aw-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{ADMIN_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                </div>
              )}
              <div className="sm:col-span-2">
                <label className="aw-label" htmlFor="description">Description</label>
                <textarea id="description" rows={2} className="aw-input" placeholder="What will be observed..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="aw-label" htmlFor="notes">Notes</label>
                <textarea id="notes" rows={2} className="aw-input" placeholder="Additional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="aw-btn-secondary" onClick={() => navigate('/observations')}>Cancel</button>
              <button type="submit" className="aw-btn-primary" disabled={submitting}>{submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}{submitting ? 'Checking availability...' : isEdit ? 'Save Changes' : 'Schedule Observation'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
