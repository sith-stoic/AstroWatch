const Observation = require('../models/Observation');
const Equipment = require('../models/Equipment');
const Maintenance = require('../models/Maintenance');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');

const populateObservation = (query) =>
  query
    .populate('equipment', 'name type location status')
    .populate('observer', 'name email role');

const combineDateAndTime = (date, timeStr) => {
  const combined = new Date(date);
  const [hours, minutes] = timeStr.split(':').map(Number);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
};

const rangesOverlap = (startA, endA, startB, endB) => startA < endB && endA > startB;

const ensureObserver = async (userId) => {
  const observer = await User.findById(userId).select('name email role');
  if (!observer || observer.role !== 'Observer') {
    const error = new Error('Assigned user must be a registered Observer');
    error.statusCode = 400;
    throw error;
  }
  return observer;
};

const validateObservationRequest = async ({
  equipmentId,
  date,
  startTime,
  endTime,
  excludeObservationId,
}) => {
  const equipment = await Equipment.findById(equipmentId);
  if (!equipment) return { error: 'Selected equipment does not exist.' };

  if (equipment.status === 'Offline') {
    return { error: `${equipment.name} is Offline and cannot be scheduled for observation.` };
  }
  if (equipment.status === 'Maintenance') {
    return { error: `${equipment.name} is currently under maintenance and cannot be scheduled.` };
  }

  let warning = null;
  if (equipment.status === 'Warning') {
    warning = `${equipment.name} currently has a Warning status. Scheduling was allowed, but please verify the equipment before use.`;
  }

  const newStart = combineDateAndTime(date, startTime);
  const newEnd = combineDateAndTime(date, endTime);
  if (newEnd <= newStart) return { error: 'End time must be after start time.' };

  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const conflictingMaintenance = await Maintenance.findOne({
    equipment: equipmentId,
    status: { $in: ['Scheduled', 'In Progress'] },
    scheduledDate: { $gte: dayStart, $lte: dayEnd },
  });

  if (conflictingMaintenance) {
    return {
      error: `${equipment.name} has a ${conflictingMaintenance.status.toLowerCase()} maintenance task ("${conflictingMaintenance.title}") on this date. Please choose another date or equipment.`,
    };
  }

  const sameDayObservations = await Observation.find({
    equipment: equipmentId,
    status: { $ne: 'Cancelled' },
    date: { $gte: dayStart, $lte: dayEnd },
    ...(excludeObservationId ? { _id: { $ne: excludeObservationId } } : {}),
  });

  for (const existing of sameDayObservations) {
    const existingStart = combineDateAndTime(existing.date, existing.startTime);
    const existingEnd = combineDateAndTime(existing.date, existing.endTime);
    if (rangesOverlap(newStart, newEnd, existingStart, existingEnd)) {
      return {
        error: `${equipment.name} is already scheduled for "${existing.target}" from ${existing.startTime} to ${existing.endTime} on this date.`,
      };
    }
  }

  return { error: null, warning };
};

// Admin sees every observation. An Observer sees only observations assigned to them.
const getObservations = asyncHandler(async (req, res) => {
  const { status, priority, equipment, search } = req.query;
  const query = {};

  if (req.user.role === 'Observer') query.observer = req.user._id;
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (equipment) query.equipment = equipment;

  if (search) {
    const matchingObservers = await User.find({
      role: 'Observer',
      name: { $regex: search, $options: 'i' },
    }).select('_id');

    const searchClauses = [
      { target: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
    if (matchingObservers.length) {
      searchClauses.push({ observer: { $in: matchingObservers.map((u) => u._id) } });
    }
    query.$or = searchClauses;
  }

  const observations = await populateObservation(Observation.find(query)).sort({ date: 1, startTime: 1 });
  res.json(observations);
});

const getObservationById = asyncHandler(async (req, res) => {
  const observation = await populateObservation(Observation.findById(req.params.id));
  if (!observation) {
    res.status(404);
    throw new Error('Observation not found');
  }

  if (req.user.role === 'Observer' && observation.observer?._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only access observations assigned to you');
  }

  res.json(observation);
});

const createObservation = asyncHandler(async (req, res) => {
  const { target, description, date, startTime, endTime, equipment, observer, priority, notes } = req.body;

  if (!target || !date || !startTime || !endTime || !equipment || !observer) {
    res.status(400);
    throw new Error('Target, date, startTime, endTime, equipment and assigned observer are required');
  }

  try {
    await ensureObserver(observer);
  } catch (error) {
    res.status(error.statusCode || 400);
    throw error;
  }

  const { error, warning } = await validateObservationRequest({
    equipmentId: equipment,
    date,
    startTime,
    endTime,
  });

  if (error) {
    res.status(409);
    throw new Error(error);
  }

  const observation = await Observation.create({
    target,
    description,
    date,
    startTime,
    endTime,
    equipment,
    observer,
    priority,
    notes,
  });

  const populated = await populateObservation(Observation.findById(observation._id));
  res.status(201).json({
    observation: populated,
    warning: warning || null,
    message: 'Observation scheduled successfully',
  });
});

const updateObservation = asyncHandler(async (req, res) => {
  const observation = await Observation.findById(req.params.id);
  if (!observation) {
    res.status(404);
    throw new Error('Observation not found');
  }

  if (req.user.role === 'Observer') {
    if (observation.observer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('You can only update observations assigned to you');
    }

    const allowedStatuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];
    if (req.body.status !== undefined) {
      if (!allowedStatuses.includes(req.body.status)) {
        res.status(400);
        throw new Error('Observers can update only their observation status and notes');
      }
      observation.status = req.body.status;
    }
    if (req.body.notes !== undefined) observation.notes = req.body.notes;

    const updated = await observation.save();
    const populated = await populateObservation(Observation.findById(updated._id));
    return res.json({ observation: populated, warning: null, message: 'Observation status updated successfully' });
  }

  const merged = {
    target: req.body.target ?? observation.target,
    description: req.body.description ?? observation.description,
    date: req.body.date ?? observation.date,
    startTime: req.body.startTime ?? observation.startTime,
    endTime: req.body.endTime ?? observation.endTime,
    equipment: req.body.equipment ?? observation.equipment.toString(),
    observer: req.body.observer ?? observation.observer.toString(),
    priority: req.body.priority ?? observation.priority,
    status: req.body.status ?? observation.status,
    notes: req.body.notes ?? observation.notes,
  };

  try {
    await ensureObserver(merged.observer);
  } catch (error) {
    res.status(error.statusCode || 400);
    throw error;
  }

  let warning = null;
  if (merged.status !== 'Cancelled') {
    const result = await validateObservationRequest({
      equipmentId: merged.equipment,
      date: merged.date,
      startTime: merged.startTime,
      endTime: merged.endTime,
      excludeObservationId: observation._id,
    });
    if (result.error) {
      res.status(409);
      throw new Error(result.error);
    }
    warning = result.warning;
  }

  Object.assign(observation, merged);
  const updated = await observation.save();
  const populated = await populateObservation(Observation.findById(updated._id));
  res.json({ observation: populated, warning: warning || null, message: 'Observation updated successfully' });
});

const deleteObservation = asyncHandler(async (req, res) => {
  const observation = await Observation.findById(req.params.id);
  if (!observation) {
    res.status(404);
    throw new Error('Observation not found');
  }
  await observation.deleteOne();
  res.json({ message: 'Observation removed', id: req.params.id });
});

module.exports = {
  getObservations,
  getObservationById,
  createObservation,
  updateObservation,
  deleteObservation,
};
