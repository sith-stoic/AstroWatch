const express = require('express');
const {
  getObservations,
  getObservationById,
  createObservation,
  updateObservation,
  deleteObservation,
} = require('../controllers/observationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getObservations).post(createObservation);
router.route('/:id').get(getObservationById).put(updateObservation).delete(deleteObservation);

module.exports = router;
