const express = require('express');
const {
  getMaintenance,
  getMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} = require('../controllers/maintenanceController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getMaintenance).post(createMaintenance);
router.route('/:id').get(getMaintenanceById).put(updateMaintenance).delete(deleteMaintenance);

module.exports = router;
