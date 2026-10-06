const Equipment = require('../models/Equipment');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all equipment (supports ?search=&status=&type=)
// @route   GET /api/equipment
// @access  Private
const getEquipment = asyncHandler(async (req, res) => {
  const { search, status, type } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }
  if (status) query.status = status;
  if (type) query.type = type;

  const equipment = await Equipment.find(query).sort({ createdAt: -1 });
  res.json(equipment);
});

// @desc    Get single equipment by id
// @route   GET /api/equipment/:id
// @access  Private
const getEquipmentById = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findById(req.params.id);
  if (!equipment) {
    res.status(404);
    throw new Error('Equipment not found');
  }
  res.json(equipment);
});

// @desc    Create new equipment
// @route   POST /api/equipment
// @access  Private
const createEquipment = asyncHandler(async (req, res) => {
  const { name, type, location, status, condition, description, lastMaintenance, nextMaintenance } = req.body;

  if (!name || !type || !location) {
    res.status(400);
    throw new Error('Name, type and location are required');
  }

  const equipment = await Equipment.create({
    name,
    type,
    location,
    status,
    condition,
    description,
    lastMaintenance: lastMaintenance || null,
    nextMaintenance: nextMaintenance || null,
  });

  res.status(201).json(equipment);
});

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private
const updateEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findById(req.params.id);
  if (!equipment) {
    res.status(404);
    throw new Error('Equipment not found');
  }

  const fields = [
    'name',
    'type',
    'location',
    'status',
    'condition',
    'description',
    'lastMaintenance',
    'nextMaintenance',
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) equipment[field] = req.body[field];
  });

  const updated = await equipment.save();
  res.json(updated);
});

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private
const deleteEquipment = asyncHandler(async (req, res) => {
  const equipment = await Equipment.findById(req.params.id);
  if (!equipment) {
    res.status(404);
    throw new Error('Equipment not found');
  }
  await equipment.deleteOne();
  res.json({ message: 'Equipment removed', id: req.params.id });
});

module.exports = {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
};
