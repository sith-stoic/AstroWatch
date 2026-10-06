const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Equipment name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Equipment type is required'],
      enum: [
        'Optical Telescope',
        'Radio Telescope',
        'CCD Camera',
        'Spectrograph',
        'Weather Sensor',
        'Tracking System',
      ],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Operational', 'Warning', 'Offline', 'Maintenance'],
      default: 'Operational',
    },
    condition: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
      default: 'Good',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    lastMaintenance: {
      type: Date,
      default: null,
    },
    nextMaintenance: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Equipment', equipmentSchema);
