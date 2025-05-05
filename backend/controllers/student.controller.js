import { Course, User, Enrollment, Review } from '../models/usermodel.js';

// Get student profile
export const getProfile = async (req, res) => {
  try {
    const student = await User.findById(req.user._id).select('-passwordHash');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update student profile
export const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;
    
    // Only allow specific fields to be updated
    const updateData = {};
    if (name) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (avatarUrl) updateData.avatarUrl = avatarUrl;
    
    const student = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    ).select('-passwordHash');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all approved courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: 'approved' })
      .populate('teacher', 'name')
      .sort({ createdAt: -1 });
    
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get a specific course detail
export const getCourseDetail = async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await Course.findOne({
      _id: id,
      status: 'approved' // Only return approved courses
    }).populate('teacher', 'name bio');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Get approved reviews for this course
    const reviews = await Review.find({ 
      course: id,
      status: 'approved'
    })
      .populate('student', 'name avatarUrl')
      .sort({ createdAt: -1 });
    
    // Check if student is enrolled
    const enrollment = await Enrollment.findOne({
      course: id,
      student: req.user._id
    });
    
    // Check if student has already reviewed this course
    const hasReviewed = await Review.findOne({
      course: id,
      student: req.user._id
    });
    
    res.json({
      course,
      reviews,
      isEnrolled: !!enrollment,
      hasReviewed: !!hasReviewed,
      stats: {
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

// Enroll in a course
export const enrollCourse = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if course exists and is approved
    const course = await Course.findOne({
      _id: id,
      status: 'approved'
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found or not approved' });
    }
    
    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      course: id,
      student: req.user._id
    });
    
    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }
    
    // Create enrollment
    const enrollment = await Enrollment.create({
      course: id,
      student: req.user._id
    });
    
    res.status(201).json(enrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get enrolled courses
export const getEnrolledCourses = async (req, res) => {
  try {
    const studentId = req.user._id;
    
    if (!studentId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Find all enrollments for this student with expanded course information
    const enrollments = await Enrollment.find({
      student: studentId
    })
      .populate({
        path: 'course',
        select: 'title description teacher status enrollmentCount rating',
        populate: {
          path: 'teacher',
          select: 'name email'
        }
      })
      .sort({ joinedAt: -1 });
    
    if (!enrollments) {
      return res.status(404).json({ message: 'No enrollments found' });
    }
    
    // Filter out courses that aren't approved
    const validEnrollments = enrollments.filter(
      enrollment => enrollment.course && enrollment.course.status === 'approved'
    );
    
    // Transform the data to include any computed properties
    const transformedEnrollments = validEnrollments.map(enrollment => {
      const enrollmentObj = enrollment.toObject();
      
      // Ensure the course object exists
      if (!enrollmentObj.course) {
        enrollmentObj.course = { 
          title: 'Unavailable Course',
          description: 'This course is no longer available',
          status: 'unavailable'
        };
      }
      
      return enrollmentObj;
    });
    
    console.log(`Returning ${transformedEnrollments.length} enrollments for student ${studentId}`);
    res.json(transformedEnrollments);
  } catch (error) {
    console.error('Error in getEnrolledCourses:', error);
    res.status(500).json({ 
      message: 'Failed to fetch enrolled courses', 
      error: error.message 
    });
  }
};

// Update course progress
export const updateCourseProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    
    // Validate progress
    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({ message: 'Progress must be between 0 and 100' });
    }
    
    // Find enrollment
    const enrollment = await Enrollment.findOne({
      course: id,
      student: req.user._id
    });
    
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found. You must enroll in the course first.' });
    }
    
    // Update progress
    enrollment.progress = progress;
    enrollment.completed = progress >= 100;
    enrollment.lastAccessedAt = Date.now();
    await enrollment.save();
    
    res.json(enrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Submit a review for a course
export const submitReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Check if course exists and is approved
    const course = await Course.findOne({
      _id: id,
      status: 'approved'
    });
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found or not approved' });
    }
    
    // Check if enrolled in the course
    const enrollment = await Enrollment.findOne({
      course: id,
      student: req.user._id
    });
    
    if (!enrollment) {
      return res.status(403).json({ message: 'You must be enrolled in the course to review it' });
    }
    
    // Check if already reviewed
    const existingReview = await Review.findOne({
      course: id,
      student: req.user._id
    });
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this course' });
    }
    
    // Create review (with pending status)
    const review = await Review.create({
      course: id,
      student: req.user._id,
      rating,
      comment,
      status: 'pending' // Reviews require admin approval
    });
    
    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get my reviews
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      student: req.user._id
    })
      .populate('course', 'title')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 