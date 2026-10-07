const express = require('express');
const { getUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, authorize('Admin'), getUsers);

module.exports = router;
