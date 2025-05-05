import { Course, User, Enrollment, Review } from '../models/usermodel.js';

// Get teacher profile
export const getProfile = async (req, res) => {
  try {
    const teacher = await User.findById(req.user._id).select('-passwordHash');
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    res.json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get teacher dashboard stats
export const getTeacherStats = async (req, res) => {
  try {
    const teacherId = req.user._id;
    
    // Get total courses count
    const totalCourses = await Course.countDocuments({ teacher: teacherId });
    
    // Get pending courses count
    const pendingCourses = await Course.countDocuments({ 
      teacher: teacherId,
      status: 'pending'
    });
    
    // Get approved courses count 
    const approvedCourses = await Course.countDocuments({ 
      teacher: teacherId,
      status: 'approved'
    });
    
    // Get course IDs for this teacher
    const courses = await Course.find({ teacher: teacherId }).select('_id');
    const courseIds = courses.map(course => course._id);
    
    // Get total students enrolled in all courses
    const totalStudents = await Enrollment.countDocuments({
      course: { $in: courseIds }
    });
    
    // Get average rating across all approved reviews
    const reviews = await Review.find({
      course: { $in: courseIds },
      status: 'approved'
    });
    
    const averageRating = reviews.length > 0
      ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
      : 0;
      
    // Get recent courses (limited to 5)
    const recentCourses = await Course.find({ teacher: teacherId })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
      
    // Enrich course data with student count and ratings
    const enrichedCourses = await Promise.all(recentCourses.map(async (course) => {
      const students = await Enrollment.countDocuments({ course: course._id });
      
      const courseReviews = await Review.find({ 
        course: course._id,
        status: 'approved'
      });
      
      const rating = courseReviews.length > 0
        ? courseReviews.reduce((acc, review) => acc + review.rating, 0) / courseReviews.length
        : 0;
        
      return {
        ...course,
        students,
        rating
      };
    }));
    
    res.json({
      stats: {
        totalCourses,
        pendingCourses,
        approvedCourses,
        totalStudents,
        averageRating
      },
      recentCourses: enrichedCourses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update teacher profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;
    
    // Only allow specific fields to be updated
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;
    
    const teacher = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-passwordHash');
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    res.json(teacher);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create a new course
export const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const course = await Course.create({
      title,
      description,
      teacher: req.user._id,
      status: 'pending' // All new courses start as pending
    });
    
    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get teacher's courses
export const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a specific course created by the teacher
export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findOne({
      _id: id,
      teacher: req.user._id
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Get all enrollments for this course
    const enrollments = await Enrollment.find({ course: id })
      .populate('student', 'name email')
      .sort({ joinedAt: -1 });
    
    // Get all approved reviews for this course
    const reviews = await Review.find({ 
      course: id,
      status: 'approved'
    })
      .populate('student', 'name')
      .sort({ createdAt: -1 });
    
    res.json({
      course,
      enrollments,
      reviews,
      stats: {
        totalEnrollments: enrollments.length,
        totalReviews: reviews.length,
        averageRating: reviews.length > 0 
          ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
          : 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    
    // Find the course and check ownership
    const course = await Course.findOne({
      _id: id,
      teacher: req.user._id
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Don't allow updates to approved courses (require re-approval)
    const updateData = {};
    if (title) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    
    // If course is already approved and we're making changes, set it back to pending
    if (course.status === 'approved' && Object.keys(updateData).length > 0) {
      updateData.status = 'pending';
    }
    
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    
    res.json(updatedCourse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 