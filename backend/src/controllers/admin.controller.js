const express = require('express');
const User = require('../models/User.model');
const AuditLog = require('../models/AuditLog.model');

const router = express.Router();

// Admin: list users - VULN: Sensitive data exposure - returns password hashes
router.get('/users', async (req, res) => {
  try {
    // VULN: Privilege check missing - only authenticated required
    const users = await User.find();
    await AuditLog.create({ user_id: req.user ? req.user._id : null, action: 'list_users', ip: req.ip });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.stack });
  }
});

// Admin: view audit logs
router.get('/audit-logs', async (req, res) => {
  try {
    const AuditLog = require('../models/AuditLog.model');
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(200);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.stack });
  }
});

module.exports = router;
