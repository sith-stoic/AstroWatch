const express = require('express');
const {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/')
  .get(getEquipment)
  .post(authorize('Admin'), createEquipment);

router.route('/:id')
  .get(getEquipmentById)
  .put(authorize('Admin'), updateEquipment)
  .delete(authorize('Admin'), deleteEquipment);

module.exports = router;
