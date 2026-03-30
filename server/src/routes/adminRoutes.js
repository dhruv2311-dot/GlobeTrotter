const express = require('express');
const router = express.Router();
const { getUsers, toggleUser, deleteUser, getAnalytics, deleteTrip, seedData } = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect, restrictTo('admin'));

router.get('/users', getUsers);
router.put('/users/:id/toggle', toggleUser);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);
router.delete('/trips/:id', deleteTrip);
router.post('/seed', seedData);

module.exports = router;
