import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  createCourse, 
  getMyCourses, 
  getCourse, 
  updateCourse,
  getTeacherStats
} from '../controllers/teacher.controller.js';
import { auth, authorize, isApprovedTeacher } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all routes
router.use(auth);
router.use(authorize('teacher'));
router.use(isApprovedTeacher);

// Profile routes
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);

// Stats route
router.get('/stats', getTeacherStats);

// Course routes
router.post('/courses', createCourse);
router.get('/courses', getMyCourses);
router.get('/courses/:id', getCourse);
router.patch('/courses/:id', updateCourse);

export default router; 