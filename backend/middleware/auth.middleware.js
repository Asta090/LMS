import jwt from 'jsonwebtoken';
import { User } from '../models/usermodel.js';

// Middleware to authenticate user and attach user data to request
export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    
    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user by id from token
    const user = await User.findById(decoded.id).select('-passwordHash');
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check user role
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `User role ${req.user.role} is not authorized to access this resource` 
      });
    }
    next();
  };
};

// Middleware to check if teacher is approved
export const isApprovedTeacher = async (req, res, next) => {
  try {
    if (req.user.role === 'teacher' && req.user.status !== 'approved') {
      return res.status(403).json({ 
        message: 'Your teacher account is pending approval' 
      });
    }
    next();
  } catch (error) {
    console.error('isApprovedTeacher middleware error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
}; 