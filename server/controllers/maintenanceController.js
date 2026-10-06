const Maintenance = require('../models/Maintenance');
const Equipment = require('../models/Equipment');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all maintenance tasks (supports ?status=&priority=&equipment=)
// @route   GET /api/maintenance
// @access  Private
const getMaintenance = asyncHandler(async (req, res) => {
  const { status, priority, equipment, search } = req.query;
  const query = {};

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (equipment) query.equipment = equipment;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { assignedTo: { $regex: search, $options: 'i' } },
    ];
  }

  const tasks = await Maintenance.find(query)
    .populate('equipment', 'name type location status')
    .sort({ scheduledDate: 1 });

  res.json(tasks);
});

// @desc    Get single maintenance task
// @route   GET /api/maintenance/:id
// @access  Private
const getMaintenanceById = asyncHandler(async (req, res) => {
  const task = await Maintenance.findById(req.params.id).populate(
    'equipment',
    'name type location status'
  );
  if (!task) {
    res.status(404);
    throw new Error('Maintenance task not found');
  }
  res.json(task);
});

// @desc    Create new maintenance task
// @route   POST /api/maintenance
// @access  Private
const createMaintenance = asyncHandler(async (req, res) => {
  const { equipment, title, description, scheduledDate, assignedTo, priority, status, notes } = req.body;

  if (!equipment || !title || !scheduledDate || !assignedTo) {
    res.status(400);
    throw new Error('Equipment, title, scheduledDate and assignedTo are required');
  }

  const equipmentExists = await Equipment.findById(equipment);
  if (!equipmentExists) {
    res.status(404);
    throw new Error('Selected equipment does not exist');
  }

  const task = await Maintenance.create({
    equipment,
    title,
    description,
    scheduledDate,
    assignedTo,
    priority,
    status,
    notes,
  });

  // If the task starts out "In Progress", reflect that on the equipment too
  if (task.status === 'In Progress') {
    equipmentExists.status = 'Maintenance';
    await equipmentExists.save();
  }

  const populated = await task.populate('equipment', 'name type location status');
  res.status(201).json(populated);
});

// @desc    Update maintenance task
// @route   PUT /api/maintenance/:id
// @access  Private
const updateMaintenance = asyncHandler(async (req, res) => {
  const task = await Maintenance.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Maintenance task not found');
  }

  const fields = [
    'equipment',
    'title',
    'description',
    'scheduledDate',
    'assignedTo',
    'priority',
    'status',
    'notes',
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) task[field] = req.body[field];
  });

  const updated = await task.save();

  // Keep equipment status roughly in sync with the task's lifecycle
  const equipment = await Equipment.findById(updated.equipment);
  if (equipment) {
    if (updated.status === 'In Progress') {
      equipment.status = 'Maintenance';
      await equipment.save();
    } else if (updated.status === 'Completed' && equipment.status === 'Maintenance') {
      equipment.status = 'Operational';
      equipment.lastMaintenance = new Date();
      await equipment.save();
    }
  }

  const populated = await updated.populate('equipment', 'name type location status');
  res.json(populated);
});

// @desc    Delete maintenance task
// @route   DELETE /api/maintenance/:id
// @access  Private
const deleteMaintenance = asyncHandler(async (req, res) => {
  const task = await Maintenance.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Maintenance task not found');
  }
  await task.deleteOne();
  res.json({ message: 'Maintenance task removed', id: req.params.id });
});

module.exports = {
  getMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
};
