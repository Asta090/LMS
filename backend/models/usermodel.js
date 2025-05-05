import mongoose from 'mongoose';
const { Schema } = mongoose;
// ...existing code...
// 1. User Schema
const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'teacher', 'student'] },
  status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  bio: { type: String },
  avatarUrl: { type: String }
}, { timestamps: true });

// 2. Course Schema
const courseSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  teacher: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, required: true, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

// 3. Enrollment Schema
const enrollmentSchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course:  { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  joinedAt: { type: Date, default: Date.now }
});

// 4. Review Schema
const reviewSchema = new Schema({
  course:  { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  status:  { type: String, required: true, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

// Model Exports
const User       = mongoose.model('User', userSchema);
const Course     = mongoose.model('Course', courseSchema);
const Enrollment = mongoose.model('Enrollment', enrollmentSchema);
const Review     = mongoose.model('Review', reviewSchema);


export  { User, Course, Enrollment, Review };
