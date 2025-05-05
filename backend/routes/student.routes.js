import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  getAllCourses, 
  getCourseDetail, 
  enrollCourse, 
  getEnrolledCourses, 
  submitReview, 
  getMyReviews,
  updateCourseProgress
} from '../controllers/student.controller.js';
import { auth, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all routes
router.use(auth);
router.use(authorize('student'));

// Profile routes
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

// Course routes
router.get('/courses', getAllCourses);
router.get('/courses/:id', getCourseDetail);
router.post('/courses/:id/enroll', enrollCourse);
router.get('/enrollments', getEnrolledCourses);

// Course progress route
router.patch('/courses/:id/progress', updateCourseProgress);

// Review routes
router.post('/courses/:id/reviews', submitReview);
router.get('/reviews', getMyReviews);

export default router; 