const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const AuditLog = require('../models/AuditLog.model');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_jwt_key';

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach full user object (including role) without re-check -- VULN: Weak Session Management / Privilege checks
    const user = await User.findById(decoded.id);
    req.user = user;
    // audit log
    try { await AuditLog.create({ user_id: user ? user._id : null, action: 'authenticate', ip: req.ip }); } catch (e) { console.error('Audit error', e); }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
