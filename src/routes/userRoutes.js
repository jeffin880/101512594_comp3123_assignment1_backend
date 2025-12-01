import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// POST /api/v1/user/signup  (already there)
router.post('/signup', async (req, res) => {
  try {
    console.log('Signup request body:', req.body);

    const {
      name,
      username,
      fullName,
      email,
      password,
    } = req.body;

    let finalName = (name || username || fullName || '').trim();
    if (!finalName && email) {
      finalName = email.split('@')[0];
    }

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: finalName || 'User',
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: 'Signup successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// 🔐 POST /api/v1/user/login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body);

    // frontend might send email, username, or emailOrUsername
    const { email, username, emailOrUsername, password } = req.body;

    const identifier = (email || username || emailOrUsername || '').trim();

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    // find by email OR name (username)
    const user = await User.findOne({
      $or: [{ email: identifier }, { name: identifier }],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // if you want, generate JWT here – but not required for this assignment
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token: 'dummy-token', // optional – can be any string for now
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
