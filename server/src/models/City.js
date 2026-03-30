const mongoose = require('mongoose');

const citySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true },
    region: { type: String, default: '' },
    description: { type: String, default: '' },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
    },
    costIndex: { type: Number, min: 1, max: 10, default: 5 }, // 1=cheap, 10=expensive
    popularityScore: { type: Number, default: 0 },
    avgDailyBudget: { type: Number, default: 100 }, // USD
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    language: { type: String, default: 'English' },
    bestTimeToVisit: { type: String, default: '' },
    tags: [{ type: String }],
    coordinates: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

citySchema.index({ name: 'text', country: 'text', region: 'text' }, { default_language: 'none' });

module.exports = mongoose.model('City', citySchema);
