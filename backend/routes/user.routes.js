import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {User} from '../models/usermodel.js'; // Import User model
import controllers from '../controllers/user.controller.js'; // Import controllers

const router = express.Router();

// --- Utilities ---
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

function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
}

// --- Auth Routes ---
// POST /api/signup
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email in use' });

    const hash = await bcrypt.hash(password, 12);
    const status = role === 'teacher' ? 'pending' : 'approved';
    const user = await User.create({ name, email, passwordHash: hash, role, status });
    res.status(201).json({ id: user._id, role: user.role, status: user.status });
  } catch (err) {
    next(err);
  }
});

// POST /api/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match || user.status !== 'approved') {
      return res.status(401).json({ message: 'Invalid credentials or not approved' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, role: user.role, name: user.name } });
  } catch (err) {
    next(err);
  }
});

// GET /api/me
router.get('/me', auth, (req, res) => {
  const { _id, name, email, role, status, bio, avatarUrl } = req.user;
  res.json({ id: _id, name, email, role, status, bio, avatarUrl });
});

// Mount other role-based controllers
router.use('/', auth, controllers);

export default router;
