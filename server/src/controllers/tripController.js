const Trip = require('../models/Trip');

// @desc    Create trip
// @route   POST /api/trips
// @access  Private
exports.createTrip = async (req, res, next) => {
  try {
    const { tripName, startDate, endDate, description, isPublic, currency, tags } = req.body;
    const tripData = { userId: req.user.id, tripName, startDate, endDate, description, isPublic, currency };
    if (tags) tripData.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    if (req.file) tripData.coverPhoto = req.file.path;

    const trip = await Trip.create(tripData);
    res.status(201).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's trips
// @route   GET /api/trips
// @access  Private
exports.getMyTrips = async (req, res, next) => {
  try {
    const { status, search, sortBy = 'createdAt', order = 'desc' } = req.query;
    const query = { userId: req.user.id };
    if (status) query.status = status;
    if (search) query.tripName = { $regex: search, $options: 'i' };

    const trips = await Trip.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .populate('userId', 'firstName lastName profileImage');

    res.status(200).json({ success: true, count: trips.length, trips });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private/Public
exports.getTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('userId', 'firstName lastName profileImage');
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    if (!trip.isPublic && (!req.user || trip.userId._id.toString() !== req.user.id)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Increment views for public trips
    if (trip.isPublic) await Trip.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.status(200).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Update trip
// @route   PUT /api/trips/:id
// @access  Private
exports.updateTrip = async (req, res, next) => {
  try {
    let trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const updateData = { ...req.body };
    if (req.file) updateData.coverPhoto = req.file.path;

    trip = await Trip.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete trip
// @route   DELETE /api/trips/:id
// @access  Private
exports.deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    await Trip.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Add stop to trip
// @route   POST /api/trips/:id/stops
// @access  Private
exports.addStop = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const stop = { ...req.body, order: trip.stops.length };
    trip.stops.push(stop);
    await trip.save();
    res.status(201).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Update stop
// @route   PUT /api/trips/:id/stops/:stopId
// @access  Private
exports.updateStop = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const stopIndex = trip.stops.findIndex((s) => s._id.toString() === req.params.stopId);
    if (stopIndex === -1) return res.status(404).json({ success: false, message: 'Stop not found' });

    Object.assign(trip.stops[stopIndex], req.body);
    await trip.save();
    res.status(200).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete stop
// @route   DELETE /api/trips/:id/stops/:stopId
// @access  Private
exports.deleteStop = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    trip.stops = trip.stops.filter((s) => s._id.toString() !== req.params.stopId);
    await trip.save();
    res.status(200).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder stops
// @route   PUT /api/trips/:id/stops/reorder
// @access  Private
exports.reorderStops = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { orderedIds } = req.body;
    const reordered = orderedIds.map((id, idx) => {
      const stop = trip.stops.find((s) => s._id.toString() === id);
      stop.order = idx;
      return stop;
    });
    trip.stops = reordered;
    await trip.save();
    res.status(200).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Add activity to stop
// @route   POST /api/trips/:id/stops/:stopId/activities
// @access  Private
exports.addActivity = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const stop = trip.stops.id(req.params.stopId);
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });

    stop.activities.push(req.body);
    await trip.save();
    res.status(201).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete activity from stop
// @route   DELETE /api/trips/:id/stops/:stopId/activities/:actId
// @access  Private
exports.deleteActivity = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (trip.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const stop = trip.stops.id(req.params.stopId);
    if (!stop) return res.status(404).json({ success: false, message: 'Stop not found' });

    stop.activities = stop.activities.filter((a) => a._id.toString() !== req.params.actId);
    await trip.save();
    res.status(200).json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// @desc    Like/Unlike a trip
// @route   POST /api/trips/:id/like
// @access  Private
exports.toggleLike = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const likeIndex = trip.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      trip.likes.splice(likeIndex, 1);
    } else {
      trip.likes.push(req.user.id);
    }
    await trip.save();
    res.status(200).json({ success: true, likes: trip.likes.length, liked: likeIndex === -1 });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to trip
// @route   POST /api/trips/:id/comments
// @access  Private
exports.addComment = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    trip.comments.push({ userId: req.user.id, text: req.body.text });
    await trip.save();
    await trip.populate('comments.userId', 'firstName lastName profileImage');
    res.status(201).json({ success: true, comments: trip.comments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public community trips
// @route   GET /api/trips/community
// @access  Public
exports.getCommunityTrips = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 12 } = req.query;
    const query = { isPublic: true };
    if (search) query.tripName = { $regex: search, $options: 'i' };

    const trips = await Trip.find(query)
      .sort({ likes: -1, views: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'firstName lastName profileImage');

    const total = await Trip.countDocuments(query);
    res.status(200).json({ success: true, trips, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};
