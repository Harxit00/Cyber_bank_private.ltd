const express = require('express');
const Account = require('../models/Account.model');
const AuditLog = require('../models/AuditLog.model');
const router = express.Router();

// GET account by id - VULN: Broken Access Control / IDOR - no ownership check
router.get('/:id', async (req, res) => {
  try {
    const acc = await Account.findById(req.params.id);
    await AuditLog.create({ user_id: req.user ? req.user._id : null, action: 'get_account', ip: req.ip, meta: { accountId: req.params.id } });
    res.json(acc);
  } catch (err) {
    res.status(500).json({ error: err.stack }); // VULN: Verbose errors
  }
});

// List own accounts
router.get('/', async (req, res) => {
  try {
    const accounts = await Account.find({ customer_id: req.user._id });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.stack });
  }
});

module.exports = router;
