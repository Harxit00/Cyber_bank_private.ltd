const express = require('express');
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuditLog = require('../models/AuditLog.model');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Prevent duplicate registrations
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    // Do NOT accept role from client; default to 'customer'
    const user = await User.create({ name, email, password: hashed, role: 'customer' });
    await AuditLog.create({ user_id: user._id, action: 'register', ip: req.ip });

    // Return safe user object (no password hash or sensitive fields)
    const safeUser = { id: user._id, name: user.name, email: user.email, role: user.role };
    res.json({ message: 'Registered', user: safeUser });
  } catch (err) {
    console.error('Auth register error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    await AuditLog.create({ user_id: user._id, action: 'login', ip: req.ip });

    const safeUser = { id: user._1d || user._id, name: user.name, email: user.email, role: user.role };
    res.json({ token, user: safeUser });
  } catch (err) {
    console.error('Auth login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
