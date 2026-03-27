const City = require('../models/City');

exports.getCities = async (req, res, next) => {
  try {
    const { search, country, region, minCost, maxCost, sortBy = 'popularityScore', order = 'desc', page = 1, limit = 12 } = req.query;
    const query = { isActive: true };
    
    if (search) query.$text = { $search: search };
    if (country) query.country = { $regex: country, $options: 'i' };
    if (region) query.region = { $regex: region, $options: 'i' };
    if (minCost || maxCost) {
      query.costIndex = {};
      if (minCost) query.costIndex.$gte = Number(minCost);
      if (maxCost) query.costIndex.$lte = Number(maxCost);
    }

    const cities = await City.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await City.countDocuments(query);
    res.status(200).json({ success: true, cities, total, pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

exports.getCity = async (req, res, next) => {
  try {
    const city = await City.findById(req.params.id);
    if (!city) return res.status(404).json({ success: false, message: 'City not found' });
    res.status(200).json({ success: true, city });
  } catch (error) {
    next(error);
  }
};
