const mongoose = require('mongoose');

const observationSchema = new mongoose.Schema(
  {
    target: {
      type: String,
      required: [true, 'Observation target is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      required: [true, 'Observation date is required'],
    },
    // Stored as 24-hour "HH:MM" strings so they are easy to render in a
    // <input type="time"> field and easy to compare using Date objects
    // built from `date` + the time string (see observationController.js)
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:MM format'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:MM format'],
    },
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Equipment',
      required: [true, 'Equipment reference is required'],
    },
    observer: {
      type: String,
      required: [true, 'Observer name is required'],
      trim: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Scheduled',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Observation', observationSchema);
