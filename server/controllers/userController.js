const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');

// Admin-only directory used by assignment dropdowns.
// GET /api/users?role=Technician or ?role=Observer
const getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const query = {};

  if (role) {
    if (!['Technician', 'Observer'].includes(role)) {
      res.status(400);
      throw new Error('Role filter must be Technician or Observer');
    }
    query.role = role;
  } else {
    query.role = { $in: ['Technician', 'Observer'] };
  }

  const users = await User.find(query).select('name email role').sort({ name: 1 });
  res.json(users);
});

module.exports = { getUsers };
