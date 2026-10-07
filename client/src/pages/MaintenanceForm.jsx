import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Wrench } from 'lucide-react';
import toast from 'react-hot-toast';
import maintenanceService from '../services/maintenanceService';
import equipmentService from '../services/equipmentService';
import userService from '../services/userService';
import Loader from '../components/common/Loader';
import StatusBadge from '../components/common/StatusBadge';
import { useAuth } from '../context/AuthContext';

const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];
const ADMIN_STATUS_OPTIONS = ['Scheduled', 'In Progress', 'Completed', 'Overdue'];
const TECH_STATUS_OPTIONS = ['Scheduled', 'In Progress', 'Completed', 'Overdue'];

const emptyForm = {
  equipment: '', title: '', description: '', scheduledDate: '', assignedTo: '', priority: 'Medium', status: 'Scheduled', notes: '',
};
const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

export default function MaintenanceForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';

  const [form, setForm] = useState(emptyForm);
  const [taskDetails, setTaskDetails] = useState(null);
  const [equipmentOptions, setEquipmentOptions] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (!isAdmin) {
          const data = await maintenanceService.getById(id);
          setTaskDetails(data);
          setForm({ ...emptyForm, status: data.status, notes: data.notes || '' });
          return;
        }

        const [equipmentList, technicianList] = await Promise.all([
          equipmentService.getAll(),
          userService.getTechnicians(),
        ]);
        setEquipmentOptions(equipmentList);
        setTechnicians(technicianList);

        if (isEdit) {
          const data = await maintenanceService.getById(id);
          setTaskDetails(data);
          setForm({
            equipment: data.equipment?._id || data.equipment,
            title: data.title,
            description: data.description || '',
            scheduledDate: toDateInput(data.scheduledDate),
            assignedTo: data.assignedTo?._id || '',
            priority: data.priority,
            status: data.status,
            notes: data.notes || '',
          });
        } else {
          setForm((f) => ({
            ...f,
            equipment: equipmentList[0]?._id || '',
            assignedTo: technicianList[0]?._id || '',
          }));
        }
      } catch (error) {
        toast.error(error.message || 'Could not load maintenance task');
        navigate('/maintenance');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit, isAdmin, navigate]);

  const validate = () => {
    if (!isAdmin) return true;
    const next = {};
    if (!form.equipment) next.equipment = 'Equipment is required';
    if (!form.title.trim()) next.title = 'Title is required';
    if (!form.scheduledDate) next.scheduledDate = 'Scheduled date is required';
    if (!form.assignedTo) next.assignedTo = 'Assigned technician is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      if (!isAdmin) {
        await maintenanceService.update(id, { status: form.status, notes: form.notes });
        toast.success('Maintenance task status updated');
      } else if (isEdit) {
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

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link to="/maintenance" className="aw-back-link"><ArrowLeft size={15} /> Back to Maintenance</Link>
        <div className="aw-card overflow-hidden p-6 sm:p-7">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-xl bg-cyan-50 p-2.5 text-cyan-600 ring-1 ring-cyan-100"><Wrench size={20} /></div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Update Assigned Task</h2>
              <p className="text-sm text-slate-500">You can update only the status and notes for this assigned maintenance task.</p>
            </div>
          </div>

          <div className="mb-6 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm sm:grid-cols-2">
            <div><span className="text-slate-400">Task</span><p className="font-medium text-slate-800">{taskDetails?.title}</p></div>
            <div><span className="text-slate-400">Equipment</span><p className="font-medium text-slate-800">{taskDetails?.equipment?.name}</p></div>
            <div><span className="text-slate-400">Priority</span><div className="mt-1"><StatusBadge value={taskDetails?.priority} /></div></div>
            <div><span className="text-slate-400">Assigned to</span><p className="font-medium text-slate-800">{taskDetails?.assignedTo?.name}</p></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="aw-label" htmlFor="status">Task Status</label>
              <select id="status" className="aw-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {TECH_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="aw-label" htmlFor="notes">Work Notes</label>
              <textarea id="notes" rows={4} className="aw-input" placeholder="Add progress or completion notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" className="aw-btn-secondary" onClick={() => navigate('/maintenance')}>Cancel</button>
              <button type="submit" className="aw-btn-primary" disabled={submitting}>{submitting ? <Loader2 size={16} className="animate-spin" /> : null}{submitting ? 'Updating...' : 'Update Task'}</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const unavailable = equipmentOptions.length === 0 || technicians.length === 0;
  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/maintenance" className="aw-back-link"><ArrowLeft size={15} /> Back to Maintenance</Link>
      <div className="aw-card overflow-hidden p-6 sm:p-7">
        <h2 className="mb-1 text-lg font-semibold text-slate-900">{isEdit ? 'Edit Maintenance Task' : 'Add Maintenance Task'}</h2>
        <p className="mb-6 text-sm text-slate-500">{isEdit ? 'Update task details or assignment.' : 'Schedule maintenance and assign it to a registered Technician.'}</p>

        {unavailable ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-sm text-amber-700">
            {equipmentOptions.length === 0 ? 'Add equipment before scheduling maintenance.' : 'No Technician accounts exist yet. Register a Technician account first.'}
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="aw-label" htmlFor="title">Title</label>
                <input id="title" type="text" className="aw-input" placeholder="Motor calibration and alignment check" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                {errors.title && <p className="aw-error-text">{errors.title}</p>}
              </div>
              <div>
                <label className="aw-label" htmlFor="equipment">Equipment</label>
                <select id="equipment" className="aw-input" value={form.equipment} onChange={(e) => setForm({ ...form, equipment: e.target.value })}>
                  {equipmentOptions.map((eq) => <option key={eq._id} value={eq._id}>{eq.name} ({eq.type})</option>)}
                </select>
                {errors.equipment && <p className="aw-error-text">{errors.equipment}</p>}
              </div>
              <div>
                <label className="aw-label" htmlFor="scheduledDate">Scheduled Date</label>
                <input id="scheduledDate" type="date" className="aw-input" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
                {errors.scheduledDate && <p className="aw-error-text">{errors.scheduledDate}</p>}
              </div>
              <div>
                <label className="aw-label" htmlFor="assignedTo">Assigned Technician</label>
                <select id="assignedTo" className="aw-input" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}>
                  {technicians.map((tech) => <option key={tech._id} value={tech._id}>{tech.name} — {tech.email}</option>)}
                </select>
                {errors.assignedTo && <p className="aw-error-text">{errors.assignedTo}</p>}
              </div>
              <div>
                <label className="aw-label" htmlFor="priority">Priority</label>
                <select id="priority" className="aw-input" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>{PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}</select>
              </div>
              {isEdit && (
                <div>
                  <label className="aw-label" htmlFor="status">Status</label>
                  <select id="status" className="aw-input" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{ADMIN_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}</select>
                </div>
              )}
              <div className="sm:col-span-2">
                <label className="aw-label" htmlFor="description">Description</label>
                <textarea id="description" rows={2} className="aw-input" placeholder="What needs to be done..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="aw-label" htmlFor="notes">Notes</label>
                <textarea id="notes" rows={2} className="aw-input" placeholder="Additional notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="aw-btn-secondary" onClick={() => navigate('/maintenance')}>Cancel</button>
              <button type="submit" className="aw-btn-primary" disabled={submitting}>{submitting ? <Loader2 size={16} className="animate-spin" /> : null}{submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Task'}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
