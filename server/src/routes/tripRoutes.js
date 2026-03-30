const express = require('express');
const router = express.Router();
const {
  createTrip, getMyTrips, getTrip, updateTrip, deleteTrip,
  addStop, updateStop, deleteStop, reorderStops,
  addActivity, deleteActivity,
  toggleLike, addComment, getCommunityTrips,
} = require('../controllers/tripController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

// Community (public)
router.get('/community', getCommunityTrips);

// Protected trip routes
router.route('/')
  .get(protect, getMyTrips)
  .post(protect, upload.single('coverPhoto'), createTrip);

router.route('/:id')
  .get((req, res, next) => { req.optionalAuth = true; next(); }, protect, getTrip)  
  .put(protect, upload.single('coverPhoto'), updateTrip)
  .delete(protect, deleteTrip);

// Stop routes
router.post('/:id/stops', protect, addStop);
router.put('/:id/stops/reorder', protect, reorderStops);
router.put('/:id/stops/:stopId', protect, updateStop);
router.delete('/:id/stops/:stopId', protect, deleteStop);

// Activity routes
router.post('/:id/stops/:stopId/activities', protect, addActivity);
router.delete('/:id/stops/:stopId/activities/:actId', protect, deleteActivity);

// Social
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);

module.exports = router;
