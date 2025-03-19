import mongoose from 'mongoose';

const vitalSignSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  heartRate: {
    type: Number,
    min: 30,
    max: 250,
    required: true
  },
  bloodPressure: {
    systolic: {
      type: Number,
      min: 50,
      max: 250,
      required: true
    },
    diastolic: {
      type: Number,
      min: 30,
      max: 150,
      required: true
    }
  },
  temperature: {
    type: Number,
    min: 34,
    max: 43,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

vitalSignSchema.index({ user: 1, timestamp: -1 });

export default mongoose.model('VitalSign', vitalSignSchema);