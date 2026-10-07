const Equipment = require('../models/Equipment');
const Maintenance = require('../models/Maintenance');
const Observation = require('../models/Observation');
const { asyncHandler } = require('../middleware/errorMiddleware');

const getEquipmentSummary = async () => {
  const [
    totalEquipment,
    operationalEquipment,
    maintenanceEquipment,
    warningOfflineEquipment,
    equipmentByStatus,
    recentEquipment,
  ] = await Promise.all([
    Equipment.countDocuments(),
    Equipment.countDocuments({ status: 'Operational' }),
    Equipment.countDocuments({ status: 'Maintenance' }),
    Equipment.countDocuments({ status: { $in: ['Warning', 'Offline'] } }),
    Equipment.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Equipment.find().sort({ updatedAt: -1 }).limit(5).select('name status updatedAt'),
  ]);

  return {
    totalEquipment,
    operationalEquipment,
    maintenanceEquipment,
    warningOfflineEquipment,
    equipmentByStatus,
    recentActivity: recentEquipment.map((e) => ({
      name: e.name,
      status: e.status,
      updatedAt: e.updatedAt,
    })),
  };
};

const getDashboardStats = asyncHandler(async (req, res) => {
  const equipment = await getEquipmentSummary();

  if (req.user.role === 'Technician') {
    const myQuery = { assignedTo: req.user._id };
    const [myMaintenanceTasks, pendingMaintenance, completedMaintenance, inProgressMaintenance, upcomingMaintenanceList] =
      await Promise.all([
        Maintenance.countDocuments(myQuery),
        Maintenance.countDocuments({ ...myQuery, status: { $in: ['Scheduled', 'In Progress', 'Overdue'] } }),
        Maintenance.countDocuments({ ...myQuery, status: 'Completed' }),
        Maintenance.countDocuments({ ...myQuery, status: 'In Progress' }),
        Maintenance.find({ ...myQuery, status: { $in: ['Scheduled', 'In Progress', 'Overdue'] } })
          .populate('equipment', 'name')
          .populate('assignedTo', 'name')
          .sort({ scheduledDate: 1 })
          .limit(5),
      ]);

    return res.json({
      role: 'Technician',
      cards: {
        totalEquipment: equipment.totalEquipment,
        operationalEquipment: equipment.operationalEquipment,
        maintenanceEquipment: equipment.maintenanceEquipment,
        warningOfflineEquipment: equipment.warningOfflineEquipment,
        myMaintenanceTasks,
        pendingMaintenance,
        inProgressMaintenance,
        completedMaintenance,
      },
      equipmentByStatus: equipment.equipmentByStatus,
      recentActivity: equipment.recentActivity,
      upcomingMaintenanceList,
      upcomingObservationsList: [],
    });
  }

  if (req.user.role === 'Observer') {
    const myQuery = { observer: req.user._id };
    const [myObservations, upcomingObservations, inProgressObservations, completedObservations, upcomingObservationsList] =
      await Promise.all([
        Observation.countDocuments(myQuery),
        Observation.countDocuments({ ...myQuery, status: { $in: ['Scheduled', 'In Progress'] } }),
        Observation.countDocuments({ ...myQuery, status: 'In Progress' }),
        Observation.countDocuments({ ...myQuery, status: 'Completed' }),
        Observation.find({ ...myQuery, status: { $in: ['Scheduled', 'In Progress'] } })
          .populate('equipment', 'name')
          .populate('observer', 'name')
          .sort({ date: 1, startTime: 1 })
          .limit(5),
      ]);

    return res.json({
      role: 'Observer',
      cards: {
        totalEquipment: equipment.totalEquipment,
        operationalEquipment: equipment.operationalEquipment,
        maintenanceEquipment: equipment.maintenanceEquipment,
        warningOfflineEquipment: equipment.warningOfflineEquipment,
        myObservations,
        upcomingObservations,
        inProgressObservations,
        completedObservations,
      },
      equipmentByStatus: equipment.equipmentByStatus,
      recentActivity: equipment.recentActivity,
      upcomingObservationsList,
      upcomingMaintenanceList: [],
    });
  }

  const [
    totalMaintenanceTasks,
    pendingMaintenance,
    upcomingObservations,
    completedObservations,
    upcomingObservationsList,
    upcomingMaintenanceList,
  ] = await Promise.all([
    Maintenance.countDocuments(),
    Maintenance.countDocuments({ status: { $in: ['Scheduled', 'In Progress', 'Overdue'] } }),
    Observation.countDocuments({ status: { $in: ['Scheduled', 'In Progress'] } }),
    Observation.countDocuments({ status: 'Completed' }),
    Observation.find({ status: { $in: ['Scheduled', 'In Progress'] } })
      .populate('equipment', 'name')
      .populate('observer', 'name')
      .sort({ date: 1, startTime: 1 })
      .limit(5),
    Maintenance.find({ status: { $in: ['Scheduled', 'In Progress', 'Overdue'] } })
      .populate('equipment', 'name')
      .populate('assignedTo', 'name')
      .sort({ scheduledDate: 1 })
      .limit(5),
  ]);

  res.json({
    role: 'Admin',
    cards: {
      totalEquipment: equipment.totalEquipment,
      operationalEquipment: equipment.operationalEquipment,
      maintenanceEquipment: equipment.maintenanceEquipment,
      warningOfflineEquipment: equipment.warningOfflineEquipment,
      totalMaintenanceTasks,
      pendingMaintenance,
      upcomingObservations,
      completedObservations,
    },
    equipmentByStatus: equipment.equipmentByStatus,
    recentActivity: equipment.recentActivity,
    upcomingObservationsList,
    upcomingMaintenanceList,
  });
});

module.exports = { getDashboardStats };
