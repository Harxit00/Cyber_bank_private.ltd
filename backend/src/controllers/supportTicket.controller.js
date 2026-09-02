const express = require('express');
const SupportTicket = require('../models/SupportTicket.model');
const AuditLog = require('../models/AuditLog.model');

const router = express.Router();

// Create support ticket - VULN: XSS - message stored raw
router.post('/', async (req, res) => {
  try {
    const { subject, message } = req.body;
    const ticket = await SupportTicket.create({ user: req.user._id, subject, message });
    await AuditLog.create({ user_id: req.user._id, action: 'create_ticket', ip: req.ip, meta: { ticketId: ticket._id } });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.stack });
  }
});

// Employee endpoint to list tickets - VULN: some manager/admin routes only check logged-in
router.get('/', async (req, res) => {
  try {
    // VULN: Privilege Escalation - only checks authenticated, not role
    const tickets = await SupportTicket.find().populate('user');
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.stack });
  }
});

module.exports = router;
