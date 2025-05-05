import { User, Course, Review, Enrollment } from '../models/usermodel.js';

// Get admin dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalCourses = await Course.countDocuments({});
    const pendingTeachers = await User.countDocuments({ role: 'teacher', status: 'pending' });
    const pendingCourses = await Course.countDocuments({ status: 'pending' });
    const pendingReviews = await Review.countDocuments({ status: 'pending' });

    res.json({
      totalStudents,
      totalTeachers,
      totalCourses,
      pendingTeachers,
      pendingCourses,
      pendingReviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all teachers with optional status filter
export const getTeachers = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { role: 'teacher' };
    
    if (status) {
      filter.status = status;
    }
    
    const teachers = await User.find(filter).select('-passwordHash');
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update teacher status (approve/reject)
export const updateTeacherStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const teacher = await User.findOneAndUpdate(
      { _id: id, role: 'teacher' },
      { status },
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

// Get all courses with optional status filter
export const getCourses = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const courses = await Course.find(filter)
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update course status (approve/reject)
export const updateCourseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const course = await Course.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('teacher', 'name email');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all reviews with optional status filter
export const getReviews = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    
    const reviews = await Review.find(filter)
      .populate('student', 'name email')
      .populate('course', 'title description')
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update review status (approve/reject)
export const updateReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const review = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate('student', 'name email')
      .populate('course', 'title');
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get detailed information about a specific teacher including their courses
export const getTeacherDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the teacher
    const teacher = await User.findOne({ _id: id, role: 'teacher' })
      .select('-passwordHash');
    
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    // Get courses created by this teacher
    const courses = await Course.find({ teacher: id })
      .sort({ createdAt: -1 });
    
    // Get total students enrolled in teacher's courses
    const enrollmentData = await Enrollment.aggregate([
      { $match: { course: { $in: courses.map(course => course._id) } } },
      { $group: { _id: '$course', count: { $sum: 1 } } }
    ]);
    
    // Map enrollment counts to courses
    const coursesWithEnrollments = courses.map(course => {
      const enrollment = enrollmentData.find(e => e._id.toString() === course._id.toString());
      return {
        ...course.toObject(),
        enrollmentCount: enrollment ? enrollment.count : 0
      };
    });
    
    // Get reviews for this teacher's courses
    const reviews = await Review.find({ course: { $in: courses.map(course => course._id) } })
      .populate('student', 'name')
      .populate('course', 'title')
      .sort({ createdAt: -1 });
    
    // Calculate average rating
    let totalRating = 0;
    let avgRating = 0;
    
    if (reviews.length > 0) {
      totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      avgRating = totalRating / reviews.length;
    }
    
    res.json({
      teacher,
      courses: coursesWithEnrollments,
      reviews,
      stats: {
        totalCourses: courses.length,
        totalStudents: enrollmentData.reduce((sum, e) => sum + e.count, 0),
        averageRating: avgRating.toFixed(1)
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all students with their enrollment information
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-passwordHash')
      .sort({ createdAt: -1 });
    
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get detailed information about a specific student including their enrollments
export const getStudentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the student
    const student = await User.findOne({ _id: id, role: 'student' })
      .select('-passwordHash');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Get enrollments for this student
    const enrollments = await Enrollment.find({ student: id })
      .populate({
        path: 'course',
        select: 'title description teacher status',
        populate: {
          path: 'teacher',
          select: 'name'
        }
      });
    
    // Get reviews submitted by this student
    const reviews = await Review.find({ student: id })
      .populate('course', 'title')
      .sort({ createdAt: -1 });
    
    res.json({
      student,
      enrollments,
      reviews,
      stats: {
        totalEnrollments: enrollments.length,
        totalReviews: reviews.length
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}; 