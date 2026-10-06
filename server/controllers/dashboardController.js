const Equipment = require('../models/Equipment');
const Maintenance = require('../models/Maintenance');
const Observation = require('../models/Observation');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Aggregate stats + recent items for the dashboard, all computed from real DB data
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalEquipment,
    operationalEquipment,
    maintenanceEquipment,
    warningOfflineEquipment,
    totalMaintenanceTasks,
    pendingMaintenance,
    upcomingObservations,
    completedObservations,
    upcomingObservationsList,
    upcomingMaintenanceList,
    equipmentByStatus,
    recentEquipment,
  ] = await Promise.all([
    Equipment.countDocuments(),
    Equipment.countDocuments({ status: 'Operational' }),
    Equipment.countDocuments({ status: 'Maintenance' }),
    Equipment.countDocuments({ status: { $in: ['Warning', 'Offline'] } }),
    Maintenance.countDocuments(),
    Maintenance.countDocuments({ status: { $in: ['Scheduled', 'In Progress'] } }),
    Observation.countDocuments({ status: { $in: ['Scheduled', 'In Progress'] } }),
    Observation.countDocuments({ status: 'Completed' }),
    Observation.find({ status: { $in: ['Scheduled', 'In Progress'] } })
      .populate('equipment', 'name')
      .sort({ date: 1, startTime: 1 })
      .limit(5),
    Maintenance.find({ status: { $in: ['Scheduled', 'In Progress'] } })
      .populate('equipment', 'name')
      .sort({ scheduledDate: 1 })
      .limit(5),
    Equipment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Equipment.find().sort({ updatedAt: -1 }).limit(5).select('name status updatedAt'),
  ]);

  res.json({
    cards: {
      totalEquipment,
      operationalEquipment,
      maintenanceEquipment,
      warningOfflineEquipment,
      totalMaintenanceTasks,
      pendingMaintenance,
      upcomingObservations,
      completedObservations,
    },
    equipmentByStatus,
    upcomingObservationsList,
    upcomingMaintenanceList,
    recentActivity: recentEquipment.map((e) => ({
      name: e.name,
      status: e.status,
      updatedAt: e.updatedAt,
    })),
  });
});

module.exports = { getDashboardStats };
