const express = require('express');
const {
  getObservations,
  getObservationById,
  createObservation,
  updateObservation,
  deleteObservation,
} = require('../controllers/observationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();
router.use(protect);

router.route('/')
  .get(authorize('Admin', 'Observer'), getObservations)
  .post(authorize('Admin'), createObservation);

router.route('/:id')
  .get(authorize('Admin', 'Observer'), getObservationById)
  .put(authorize('Admin', 'Observer'), updateObservation)
  .delete(authorize('Admin'), deleteObservation);

module.exports = router;
