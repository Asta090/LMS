import mongoose from 'mongoose';

const enrollmentSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Ensure each student can only enroll once in a course
enrollmentSchema.index({ course: 1, student: 1 }, { unique: true });

// Method to update progress
enrollmentSchema.methods.updateProgress = async function(newProgress) {
  this.progress = Math.min(Math.max(newProgress, 0), 100);
  this.completed = this.progress >= 100;
  this.lastAccessedAt = Date.now();
  return this.save();
};

export const Enrollment = mongoose.model('Enrollment', enrollmentSchema); 