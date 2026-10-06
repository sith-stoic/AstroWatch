const express = require('express');
const {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} = require('../controllers/equipmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect); // every equipment route requires a logged-in user

router.route('/').get(getEquipment).post(createEquipment);
router.route('/:id').get(getEquipmentById).put(updateEquipment).delete(deleteEquipment);

module.exports = router;
