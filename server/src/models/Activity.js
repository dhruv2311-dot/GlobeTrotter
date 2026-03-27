const mongoose = require('mongoose');

const activityCatalogSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['sightseeing', 'food', 'adventure', 'culture', 'shopping', 'transport', 'accommodation', 'other'],
      required: true,
    },
    description: { type: String, default: '' },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800',
    },
    avgCost: { type: Number, default: 0 }, // USD
    duration: { type: Number, default: 2 }, // hours
    cityId: { type: mongoose.Schema.Types.ObjectId, ref: 'City' },
    cityName: { type: String, default: '' },
    country: { type: String, default: '' },
    rating: { type: Number, min: 0, max: 5, default: 4 },
    tags: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

activityCatalogSchema.index({ name: 'text', description: 'text', category: 1 });

module.exports = mongoose.model('ActivityCatalog', activityCatalogSchema);
