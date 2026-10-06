const Observation = require('../models/Observation');
const Equipment = require('../models/Equipment');
const Maintenance = require('../models/Maintenance');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Combines a date (Date object / ISO string) with a "HH:MM" time string into
// a single Date instance so two observations can be compared reliably.
const combineDateAndTime = (date, timeStr) => {
  const combined = new Date(date);
  const [hours, minutes] = timeStr.split(':').map(Number);
  combined.setHours(hours, minutes, 0, 0);
  return combined;
};

// Returns true if two [start, end) ranges overlap.
const rangesOverlap = (startA, endA, startB, endB) => startA < endB && endA > startB;

// Runs every cross-module validation check described in the project brief.
// Returns { error, warning } - error blocks creation, warning is informational only.
const validateObservationRequest = async ({
  equipmentId,
  date,
  startTime,
  endTime,
  excludeObservationId,
}) => {
  // 1. Equipment must exist
  const equipment = await Equipment.findById(equipmentId);
  if (!equipment) {
    return { error: 'Selected equipment does not exist.' };
  }

  // 2. Equipment status must allow scheduling
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

  if (newEnd <= newStart) {
    return { error: 'End time must be after start time.' };
  }

  // 3. Maintenance conflict - same equipment, same calendar day, active task
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

  // 4. Observation time conflict - same equipment, same day, overlapping time range
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

// @desc    Get all observations (supports ?status=&priority=&equipment=&search=)
// @route   GET /api/observations
// @access  Private
const getObservations = asyncHandler(async (req, res) => {
  const { status, priority, equipment, search } = req.query;
  const query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (equipment) query.equipment = equipment;
  if (search) {
    query.$or = [
      { target: { $regex: search, $options: 'i' } },
      { observer: { $regex: search, $options: 'i' } },
    ];
  }

  const observations = await Observation.find(query)
    .populate('equipment', 'name type location status')
    .sort({ date: 1, startTime: 1 });

  res.json(observations);
});

// @desc    Get single observation
// @route   GET /api/observations/:id
// @access  Private
const getObservationById = asyncHandler(async (req, res) => {
  const observation = await Observation.findById(req.params.id).populate(
    'equipment',
    'name type location status'
  );
  if (!observation) {
    res.status(404);
    throw new Error('Observation not found');
  }
  res.json(observation);
});

// @desc    Create new observation (runs full validation pipeline)
// @route   POST /api/observations
// @access  Private
const createObservation = asyncHandler(async (req, res) => {
  const { target, description, date, startTime, endTime, equipment, observer, priority, notes } = req.body;

  if (!target || !date || !startTime || !endTime || !equipment || !observer) {
    res.status(400);
    throw new Error('Target, date, startTime, endTime, equipment and observer are required');
  }

  const { error, warning } = await validateObservationRequest({
    equipmentId: equipment,
    date,
    startTime,
    endTime,
  });

  if (error) {
    res.status(409); // Conflict
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

  const populated = await observation.populate('equipment', 'name type location status');

  res.status(201).json({
    observation: populated,
    warning: warning || null,
    message: 'Observation scheduled successfully',
  });
});

// @desc    Update observation (re-runs validation, excluding itself)
// @route   PUT /api/observations/:id
// @access  Private
const updateObservation = asyncHandler(async (req, res) => {
  const observation = await Observation.findById(req.params.id);
  if (!observation) {
    res.status(404);
    throw new Error('Observation not found');
  }

  const merged = {
    target: req.body.target ?? observation.target,
    description: req.body.description ?? observation.description,
    date: req.body.date ?? observation.date,
    startTime: req.body.startTime ?? observation.startTime,
    endTime: req.body.endTime ?? observation.endTime,
    equipment: req.body.equipment ?? observation.equipment.toString(),
    observer: req.body.observer ?? observation.observer,
    priority: req.body.priority ?? observation.priority,
    status: req.body.status ?? observation.status,
    notes: req.body.notes ?? observation.notes,
  };

  // Only re-run conflict checks if the change could actually create a new conflict,
  // and skip them entirely if the observation is being cancelled.
  let warning = null;
  if (merged.status !== 'Cancelled') {
    const { error, warning: w } = await validateObservationRequest({
      equipmentId: merged.equipment,
      date: merged.date,
      startTime: merged.startTime,
      endTime: merged.endTime,
      excludeObservationId: observation._id,
    });

    if (error) {
      res.status(409);
      throw new Error(error);
    }
    warning = w;
  }

  Object.assign(observation, merged);
  const updated = await observation.save();
  const populated = await updated.populate('equipment', 'name type location status');

  res.json({ observation: populated, warning: warning || null, message: 'Observation updated successfully' });
});

// @desc    Delete observation
// @route   DELETE /api/observations/:id
// @access  Private
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
