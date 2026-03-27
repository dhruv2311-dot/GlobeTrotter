const User = require('../models/User');
const Trip = require('../models/Trip');
const City = require('../models/City');
const ActivityCatalog = require('../models/Activity');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const query = {};
    if (search) query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    if (role) query.role = role;

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await User.countDocuments(query);
    res.status(200).json({ success: true, users, total });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active
// @route   PUT /api/admin/users/:id/toggle
// @access  Admin
exports.toggleUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Admin
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Trip.deleteMany({ userId: req.params.id });
    res.status(200).json({ success: true, message: 'User and trips deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Analytics dashboard
// @route   GET /api/admin/analytics
// @access  Admin
exports.getAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalTrips, totalCities, totalActivities, publicTrips, recentUsers] = await Promise.all([
      User.countDocuments(),
      Trip.countDocuments(),
      City.countDocuments(),
      ActivityCatalog.countDocuments(),
      Trip.countDocuments({ isPublic: true }),
      User.find().sort({ createdAt: -1 }).limit(10).select('firstName lastName email profileImage createdAt'),
    ]);

    // Top cities by trip count
    const topCities = await Trip.aggregate([
      { $unwind: '$stops' },
      { $group: { _id: '$stops.city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Trip status distribution
    const tripsByStatus = await Trip.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Users per month (last 6 months)
    const usersPerMonth = await User.aggregate([
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 6 },
    ]);

    // Top activities by category
    const activitiesByCategory = await ActivityCatalog.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalTrips,
        totalCities,
        totalActivities,
        publicTrips,
        topCities,
        tripsByStatus,
        usersPerMonth,
        activitiesByCategory,
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete trip (admin)
// @route   DELETE /api/admin/trips/:id
// @access  Admin
exports.deleteTrip = async (req, res, next) => {
  try {
    await Trip.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Trip deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed cities and activities
// @route   POST /api/admin/seed
// @access  Admin
exports.seedData = async (req, res, next) => {
  try {
    const cities = [
      { name: 'Paris', country: 'France', region: 'Europe', costIndex: 8, popularityScore: 98, avgDailyBudget: 180, description: 'City of Light and Love', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', bestTimeToVisit: 'April–June, Sept–Oct', tags: ['romantic', 'culture', 'food'] },
      { name: 'Tokyo', country: 'Japan', region: 'Asia', costIndex: 7, popularityScore: 96, avgDailyBudget: 160, description: 'Where tradition meets the future', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', bestTimeToVisit: 'March–May, Oct', tags: ['culture', 'food', 'technology'] },
      { name: 'New York', country: 'USA', region: 'North America', costIndex: 9, popularityScore: 95, avgDailyBudget: 250, description: 'The city that never sleeps', image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800', bestTimeToVisit: 'Apr–Jun, Sept–Nov', tags: ['urban', 'culture', 'food'] },
      { name: 'Barcelona', country: 'Spain', region: 'Europe', costIndex: 6, popularityScore: 92, avgDailyBudget: 130, description: 'Art, architecture and beaches', image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800', bestTimeToVisit: 'May–June, Sept', tags: ['beach', 'culture', 'nightlife'] },
      { name: 'Bali', country: 'Indonesia', region: 'Asia', costIndex: 3, popularityScore: 93, avgDailyBudget: 60, description: 'Island of the Gods', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', bestTimeToVisit: 'Apr–Oct', tags: ['beach', 'spiritual', 'nature'] },
      { name: 'Dubai', country: 'UAE', region: 'Middle East', costIndex: 9, popularityScore: 90, avgDailyBudget: 300, description: 'Luxury and modernity in the desert', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', bestTimeToVisit: 'Nov–Mar', tags: ['luxury', 'shopping', 'modern'] },
      { name: 'Rome', country: 'Italy', region: 'Europe', costIndex: 7, popularityScore: 94, avgDailyBudget: 150, description: 'The Eternal City', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', bestTimeToVisit: 'Apr–Jun, Sept–Oct', tags: ['history', 'culture', 'food'] },
      { name: 'Santorini', country: 'Greece', region: 'Europe', costIndex: 8, popularityScore: 91, avgDailyBudget: 200, description: 'Iconic blue domes and sunsets', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', bestTimeToVisit: 'May–Oct', tags: ['romantic', 'beach', 'photography'] },
      { name: 'Bangkok', country: 'Thailand', region: 'Asia', costIndex: 3, popularityScore: 89, avgDailyBudget: 55, description: 'Temple meets street food paradise', image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', bestTimeToVisit: 'Nov–Feb', tags: ['budget', 'food', 'culture'] },
      { name: 'Maldives', country: 'Maldives', region: 'Asia', costIndex: 10, popularityScore: 88, avgDailyBudget: 500, description: 'Overwater bungalows and crystal waters', image: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800', bestTimeToVisit: 'Nov–Apr', tags: ['luxury', 'beach', 'romantic'] },
      { name: 'Kyoto', country: 'Japan', region: 'Asia', costIndex: 6, popularityScore: 91, avgDailyBudget: 140, description: 'Ancient temples and geishas', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', bestTimeToVisit: 'March–May, Oct–Nov', tags: ['history', 'culture', 'spiritual'] },
      { name: 'Amsterdam', country: 'Netherlands', region: 'Europe', costIndex: 8, popularityScore: 87, avgDailyBudget: 170, description: 'Canals, bikes and museums', image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800', bestTimeToVisit: 'Apr–May, Sept', tags: ['culture', 'museums', 'scenic'] },
    ];

    await City.deleteMany({});
    const createdCities = await City.insertMany(cities);

    const activities = [
      { name: 'Eiffel Tower Visit', category: 'sightseeing', avgCost: 25, duration: 3, cityName: 'Paris', country: 'France', rating: 4.8, image: 'https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800', description: 'Iconic iron lattice tower on the Champ de Mars' },
      { name: 'Louvre Museum', category: 'culture', avgCost: 17, duration: 4, cityName: 'Paris', country: 'France', rating: 4.9, image: 'https://images.unsplash.com/photo-1499856871958-5b9ecb1e24a6?w=800', description: 'World\'s largest art museum' },
      { name: 'Tsukiji Fish Market', category: 'food', avgCost: 30, duration: 2, cityName: 'Tokyo', country: 'Japan', rating: 4.7, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800', description: 'Fresh sushi and sashimi experience' },
      { name: 'Shibuya Crossing', category: 'sightseeing', avgCost: 0, duration: 1, cityName: 'Tokyo', country: 'Japan', rating: 4.5, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', description: 'World\'s busiest pedestrian crossing' },
      { name: 'Central Park Walk', category: 'adventure', avgCost: 0, duration: 2, cityName: 'New York', country: 'USA', rating: 4.6, image: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=800', description: 'Iconic urban park in Manhattan' },
      { name: 'Statue of Liberty', category: 'sightseeing', avgCost: 24, duration: 3, cityName: 'New York', country: 'USA', rating: 4.7, image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800', description: 'Symbol of freedom and democracy' },
      { name: 'Sagrada Familia', category: 'culture', avgCost: 26, duration: 2, cityName: 'Barcelona', country: 'Spain', rating: 4.9, image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800', description: 'Gaudi\'s unfinished masterpiece' },
      { name: 'Ubud Monkey Forest', category: 'adventure', avgCost: 5, duration: 2, cityName: 'Bali', country: 'Indonesia', rating: 4.4, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', description: 'Sacred monkey sanctuary' },
      { name: 'Burj Khalifa Observation Deck', category: 'sightseeing', avgCost: 50, duration: 2, cityName: 'Dubai', country: 'UAE', rating: 4.8, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', description: 'World\'s tallest building views' },
      { name: 'Colosseum Tour', category: 'history', avgCost: 16, duration: 3, cityName: 'Rome', country: 'Italy', rating: 4.8, image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', description: 'Ancient Roman amphitheatre' },
      { name: 'Oia Sunset', category: 'sightseeing', avgCost: 0, duration: 2, cityName: 'Santorini', country: 'Greece', rating: 4.9, image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', description: 'Most beautiful sunset in the world' },
      { name: 'Street Food Tour', category: 'food', avgCost: 20, duration: 3, cityName: 'Bangkok', country: 'Thailand', rating: 4.8, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800', description: 'Thai street food adventure' },
    ];

    await ActivityCatalog.deleteMany({});
    await ActivityCatalog.insertMany(activities);

    res.status(200).json({ success: true, message: 'Data seeded successfully', cities: createdCities.length, activities: activities.length });
  } catch (error) {
    next(error);
  }
};
