const express = require('express');
const {
  getMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} = require('../controllers/maintenanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/')
  .get(authorize('Admin', 'Technician'), getMaintenance)
  .post(authorize('Admin'), createMaintenance);

router.route('/:id')
  .get(authorize('Admin', 'Technician'), getMaintenanceById)
  .put(authorize('Admin', 'Technician'), updateMaintenance)
  .delete(authorize('Admin'), deleteMaintenance);

module.exports = router;
