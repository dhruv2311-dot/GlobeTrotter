const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ['sightseeing', 'food', 'adventure', 'culture', 'shopping', 'transport', 'accommodation', 'other'],
    default: 'other',
  },
  cost: { type: Number, default: 0 },
  duration: { type: Number, default: 1 }, // hours
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  startTime: { type: String, default: '' },
  notes: { type: String, default: '' },
});

const stopSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, default: '' },
  cityImage: { type: String, default: '' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  activities: [activitySchema],
  sectionBudget: { type: Number, default: 0 },
  accommodation: { type: String, default: '' },
  notes: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tripName: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String, default: '' },
    coverPhoto: {
      type: String,
      default: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200',
    },
    stops: [stopSchema],
    totalBudget: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    isPublic: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed'],
      default: 'upcoming',
    },
    tags: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-calculate total budget from stops
tripSchema.pre('save', function () {
  if (this.stops && this.stops.length > 0) {
    let total = 0;
    this.stops.forEach((stop) => {
      let stopBudget = 0;
      if (stop.activities && stop.activities.length > 0) {
        stopBudget = stop.activities.reduce((sum, act) => sum + (act.cost || 0), 0);
      }
      stop.sectionBudget = stopBudget;
      total += stopBudget;
    });
    this.totalBudget = total;
  }

  // Auto-update status
  const now = new Date();
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  if (now < start) this.status = 'upcoming';
  else if (now >= start && now <= end) this.status = 'ongoing';
  else this.status = 'completed';
});

module.exports = mongoose.model('Trip', tripSchema);
