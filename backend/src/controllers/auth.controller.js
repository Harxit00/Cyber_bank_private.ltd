const express = require('express');
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuditLog = require('../models/AuditLog.model');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '4', 10); // VULN: weak bcrypt rounds

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('REGISTER BODY:', req.body); // VULN: Logging sensitive data
    const { name, email, password, role } = req.body; // VULN: Privilege Escalation - role accepted from client
    const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const user = await User.create({ name, email, password: hashed, role });
    await AuditLog.create({ user_id: user._id, action: 'register', ip: req.ip });
    res.json({ message: 'Registered', user }); // VULN: Sensitive data exposure - returning password hash & whole user
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.stack }); // VULN: Verbose errors
  }
});

// Login (no rate-limiting) - VULN: Weak Authentication / Brute Force
router.post('/login', async (req, res) => {
  try {
    console.log('LOGIN BODY:', req.body); // VULN: Logging sensitive data
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN }); // VULN: long expiry
    await AuditLog.create({ user_id: user._id, action: 'login', ip: req.ip });
    res.json({ token, user }); // VULN: Sensitive data exposure
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.stack }); // VULN: Verbose errors
  }
});

module.exports = router;
