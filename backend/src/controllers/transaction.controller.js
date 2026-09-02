const express = require('express');
const Transaction = require('../models/Transaction.model');
const Account = require('../models/Account.model');
const AuditLog = require('../models/AuditLog.model');

const router = express.Router();

// Create transaction
router.post('/', async (req, res) => {
  try {
    const { from_account, to_account, amount, remarks } = req.body;
    const txn = await Transaction.create({ from_account, to_account, amount, remarks }); // remarks stored raw - VULN: XSS
    await AuditLog.create({ user_id: req.user._id, action: 'create_txn', ip: req.ip, meta: { txnId: txn._id } });
    res.json(txn);
  } catch (err) {
    res.status(500).json({ error: err.stack });
  }
});

// GET transaction by id - VULN: IDOR - no ownership check
router.get('/:id', async (req, res) => {
  try {
    const txn = await Transaction.findById(req.params.id);
    await AuditLog.create({ user_id: req.user ? req.user._id : null, action: 'get_txn', ip: req.ip, meta: { txnId: req.params.id } });
    res.json(txn);
  } catch (err) {
    res.status(500).json({ error: err.stack });
  }
});

// Search / reports - VULN: NoSQL Injection by using raw req.query to build Mongo query
router.post('/reports', async (req, res) => {
  try {
    // VULN: NoSQL Injection - building query from client-supplied body
    const raw = req.body.query || req.body;
    const query = raw; // intentionally using raw object
    const results = await Transaction.find(query).limit(100);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.stack });
  }
});

module.exports = router;
