const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    country: { type: String, default: '' },
    profileImage: {
      type: String,
      default: 'https://res.cloudinary.com/demo/image/upload/v1/globetrotter/default-avatar.png',
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    savedTrips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }],
    bio: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', userSchema);
