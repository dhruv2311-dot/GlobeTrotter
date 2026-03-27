const ActivityCatalog = require('../models/Activity');

exports.getActivities = async (req, res, next) => {
  try {
    const { search, category, cityName, minCost, maxCost, minDuration, maxDuration, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (cityName) query.cityName = { $regex: cityName, $options: 'i' };
    if (minCost || maxCost) {
      query.avgCost = {};
      if (minCost) query.avgCost.$gte = Number(minCost);
      if (maxCost) query.avgCost.$lte = Number(maxCost);
    }
    if (minDuration || maxDuration) {
      query.duration = {};
      if (minDuration) query.duration.$gte = Number(minDuration);
      if (maxDuration) query.duration.$lte = Number(maxDuration);
    }

    const activities = await ActivityCatalog.find(query)
      .sort({ rating: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('cityId', 'name country');

    const total = await ActivityCatalog.countDocuments(query);
    res.status(200).json({ success: true, activities, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

exports.getActivity = async (req, res, next) => {
  try {
    const activity = await ActivityCatalog.findById(req.params.id).populate('cityId', 'name country');
    if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
    res.status(200).json({ success: true, activity });
  } catch (error) {
    next(error);
  }
};
