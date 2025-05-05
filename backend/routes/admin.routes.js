import express from 'express';
import { 
  getDashboardStats, 
  getTeachers, 
  updateTeacherStatus, 
  getCourses, 
  updateCourseStatus, 
  getReviews, 
  updateReviewStatus,
  getTeacherDetails,
  getStudents,
  getStudentDetails
} from '../controllers/admin.controller.js';
import { auth } from '../middleware/auth.middleware.js';
import { authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all routes and authorize only admin
router.use(auth);
router.use(authorize('admin'));

// Dashboard stats
router.get('/stats', getDashboardStats);

// Teacher routes
router.get('/teachers', getTeachers);
router.patch('/teachers/:id/status', updateTeacherStatus);
router.get('/teachers/:id/details', getTeacherDetails);

// Student routes
router.get('/students', getStudents);
router.get('/students/:id/details', getStudentDetails);

// Course routes
router.get('/courses', getCourses);
router.patch('/courses/:id/status', updateCourseStatus);

// Review routes
router.get('/reviews', getReviews);
router.patch('/reviews/:id/status', updateReviewStatus);

export default router; 