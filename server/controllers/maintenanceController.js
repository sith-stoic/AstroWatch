const Maintenance = require('../models/Maintenance');
const Equipment = require('../models/Equipment');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');

const populateTask = (query) =>
  query
    .populate('equipment', 'name type location status')
    .populate('assignedTo', 'name email role');

const ensureTechnician = async (userId) => {
  const technician = await User.findById(userId).select('name email role');
  if (!technician || technician.role !== 'Technician') {
    const error = new Error('Assigned user must be a registered Technician');
    error.statusCode = 400;
    throw error;
  }
  return technician;
};

const isAssignedTechnician = (task, userId) => task.assignedTo?.toString() === userId.toString();

const syncEquipmentStatus = async (task) => {
  const equipment = await Equipment.findById(task.equipment);
  if (!equipment) return;

  if (task.status === 'In Progress') {
    if (equipment.status !== 'Maintenance') {
      equipment.status = 'Maintenance';
      await equipment.save();
    }
    return;
  }

  if (task.status === 'Completed') {
    const anotherActiveTask = await Maintenance.exists({
      _id: { $ne: task._id },
      equipment: task.equipment,
      status: 'In Progress',
    });

    equipment.lastMaintenance = new Date();
    if (!anotherActiveTask && equipment.status === 'Maintenance') {
      equipment.status = 'Operational';
    }
    await equipment.save();
  }
};

// Admin sees all maintenance tasks. A Technician sees only tasks assigned to them.
const getMaintenance = asyncHandler(async (req, res) => {
  const { status, priority, equipment, search } = req.query;
  const query = {};

  if (req.user.role === 'Technician') query.assignedTo = req.user._id;
  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (equipment) query.equipment = equipment;

  if (search) {
    const matchingTechnicians = await User.find({
      role: 'Technician',
      name: { $regex: search, $options: 'i' },
    }).select('_id');

    const searchClauses = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];

    if (matchingTechnicians.length) {
      searchClauses.push({ assignedTo: { $in: matchingTechnicians.map((u) => u._id) } });
    }

    query.$or = searchClauses;
  }

  const tasks = await populateTask(Maintenance.find(query)).sort({ scheduledDate: 1 });
  res.json(tasks);
});

const getMaintenanceById = asyncHandler(async (req, res) => {
  const task = await populateTask(Maintenance.findById(req.params.id));
  if (!task) {
    res.status(404);
    throw new Error('Maintenance task not found');
  }

  if (req.user.role === 'Technician' && task.assignedTo?._id.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only access maintenance tasks assigned to you');
  }

  res.json(task);
});

const createMaintenance = asyncHandler(async (req, res) => {
  const { equipment, title, description, scheduledDate, assignedTo, priority, status, notes } = req.body;

  if (!equipment || !title || !scheduledDate || !assignedTo) {
    res.status(400);
    throw new Error('Equipment, title, scheduledDate and assigned technician are required');
  }

  const equipmentExists = await Equipment.findById(equipment);
  if (!equipmentExists) {
    res.status(404);
    throw new Error('Selected equipment does not exist');
  }

  try {
    await ensureTechnician(assignedTo);
  } catch (error) {
    res.status(error.statusCode || 400);
    throw error;
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

  await syncEquipmentStatus(task);
  const populated = await populateTask(Maintenance.findById(task._id));
  res.status(201).json(populated);
});

const updateMaintenance = asyncHandler(async (req, res) => {
  const task = await Maintenance.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Maintenance task not found');
  }

  if (req.user.role === 'Technician') {
    if (!isAssignedTechnician(task, req.user._id)) {
      res.status(403);
      throw new Error('You can only update maintenance tasks assigned to you');
    }

    const allowedStatuses = ['Scheduled', 'In Progress', 'Completed', 'Overdue'];
    if (req.body.status !== undefined) {
      if (!allowedStatuses.includes(req.body.status)) {
        res.status(400);
        throw new Error('Technicians can update only the maintenance task status and notes');
      }
      task.status = req.body.status;
    }
    if (req.body.notes !== undefined) task.notes = req.body.notes;
  } else {
    if (req.body.equipment !== undefined) {
      const equipmentExists = await Equipment.findById(req.body.equipment);
      if (!equipmentExists) {
        res.status(404);
        throw new Error('Selected equipment does not exist');
      }
    }

    if (req.body.assignedTo !== undefined) {
      try {
        await ensureTechnician(req.body.assignedTo);
      } catch (error) {
        res.status(error.statusCode || 400);
        throw error;
      }
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
  }

  const updated = await task.save();
  await syncEquipmentStatus(updated);
  const populated = await populateTask(Maintenance.findById(updated._id));
  res.json(populated);
});

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
