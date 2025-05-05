import express from 'express';
import jwt from 'jsonwebtoken';

import { User, Course, Enrollment, Review } from '../models/usermodel.js'; // Import User model
const router = express.Router();

// Middleware: authenticate & attach user
async function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authenticated' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.status !== 'approved') throw new Error();
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Middleware: role check
function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

// ------- Admin Controllers -------
// GET /api/admin/stats
router.get('/admin/stats', auth, requireRole('admin'), async (req, res) => {
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalTeachers = await User.countDocuments({ role: 'teacher' });
  res.json({ totalStudents, totalTeachers });
});

// GET /api/admin/teachers?status=pending
router.get('/admin/teachers', auth, requireRole('admin'), async (req, res) => {
  const status = req.query.status || 'pending';
  const teachers = await User.find({ role: 'teacher', status });
  res.json(teachers);
});

// PATCH /api/admin/teachers/:id/status
router.patch('/admin/teachers/:id/status', auth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'
  const teacher = await User.findOneAndUpdate(
    { _id: id, role: 'teacher' },
    { status },
    { new: true }
  );
  res.json(teacher);
});

// GET /api/admin/courses?status=pending
router.get('/admin/courses', auth, requireRole('admin'), async (req, res) => {
  const status = req.query.status || 'pending';
  const courses = await Course.find({ status }).populate('teacher', 'name email');
  res.json(courses);
});

// PATCH /api/admin/courses/:id/status
router.patch('/admin/courses/:id/status', auth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const course = await Course.findByIdAndUpdate(id, { status }, { new: true });
  res.json(course);
});

// GET /api/admin/reviews?status=pending
router.get('/admin/reviews', auth, requireRole('admin'), async (req, res) => {
  const status = req.query.status || 'pending';
  const reviews = await Review.find({ status })
    .populate('student', 'name email')
    .populate('course', 'title');
  res.json(reviews);
});

// PATCH /api/admin/reviews/:id/status
router.patch('/admin/reviews/:id/status', auth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
  res.json(review);
});

// ------- Teacher Controllers -------
// GET /api/teacher/courses
router.get('/teacher/courses', auth, requireRole('teacher'), async (req, res) => {
  const courses = await Course.find({ teacher: req.user._id });
  res.json(courses);
});

// POST /api/teacher/courses
router.post('/teacher/courses', auth, requireRole('teacher'), async (req, res) => {
  const { title, description } = req.body;
  const course = await Course.create({ title, description, teacher: req.user._id });
  res.status(201).json(course);
});

// PATCH /api/teacher/profile
router.patch('/teacher/profile', auth, requireRole('teacher'), async (req, res) => {
  const updates = (({ name, bio, avatarUrl }) => ({ name, bio, avatarUrl }))(req.body);
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json(user);
});

// ------- Student Controllers -------
// GET /api/courses?status=approved
router.get('/courses', auth, async (req, res) => {
  const courses = await Course.find({ status: 'approved' }).populate('teacher', 'name');
  res.json(courses);
});

// POST /api/courses/:id/join
router.post('/courses/:id/join', auth, requireRole('student'), async (req, res) => {
  const enrollment = await Enrollment.create({ student: req.user._id, course: req.params.id });
  res.status(201).json(enrollment);
});

// GET /api/student/enrollments
router.get('/student/enrollments', auth, requireRole('student'), async (req, res) => {
  const enrollments = await Enrollment.find({ student: req.user._id }).populate('course');
  res.json(enrollments);
});

// POST /api/courses/:id/reviews
router.post('/courses/:id/reviews', auth, requireRole('student'), async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.create({
    course: req.params.id,
    student: req.user._id,
    rating,
    comment
  });
  res.status(201).json(review);
});

// GET /api/student/reviews
router.get('/student/reviews', auth, requireRole('student'), async (req, res) => {
  const reviews = await Review.find({ student: req.user._id });
  res.json(reviews);
});

// PATCH /api/student/profile
router.patch('/student/profile', auth, requireRole('student'), async (req, res) => {
  const updates = (({ name, bio, avatarUrl }) => ({ name, bio, avatarUrl }))(req.body);
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json(user);
});

export default router;
