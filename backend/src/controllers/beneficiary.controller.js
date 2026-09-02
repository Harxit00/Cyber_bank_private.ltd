const express = require('express');
const router = express.Router();
const { Beneficiary, AuditLog } = require('../models');

// GET / — list beneficiaries for logged-in customer
router.get('/', async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({ customer_id: req.user._id }).lean();
    res.json({ beneficiaries, count: beneficiaries.length });
  } catch (error) {
    console.error('Error fetching beneficiaries:', error);
    res.status(500).json({ error: 'Failed to fetch beneficiaries' });
  }
});

// POST / — add new beneficiary
router.post('/', async (req, res) => {
  try {
    const { name, account_number, bank_name } = req.body;

    const beneficiary = await Beneficiary.create({
      customer_id: req.user._id,
      name,
      account_number,
      bank_name,
    });

    // Audit log
    try {
      await AuditLog.create({
        user_id: req.user._id,
        action: `Added beneficiary ${beneficiary._id}`,
        ip: req.ip,
      });
    } catch (auditError) {
      console.error('Audit log error:', auditError);
    }

    res.status(201).json({ beneficiary });
  } catch (error) {
    console.error('Error creating beneficiary:', error);
    res.status(500).json({ error: 'Failed to create beneficiary' });
  }
});

// DELETE /:id — remove beneficiary
// VULN: Broken Access Control — doesn't verify beneficiary belongs to req.user before deleting
router.delete('/:id', async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findByIdAndDelete(req.params.id);

    if (!beneficiary) {
      return res.status(404).json({ error: 'Beneficiary not found' });
    }

    // Audit log
    try {
      await AuditLog.create({
        user_id: req.user._id,
        action: `Deleted beneficiary ${req.params.id}`,
        ip: req.ip,
      });
    } catch (auditError) {
      console.error('Audit log error:', auditError);
    }

    res.json({ message: 'Beneficiary deleted successfully' });
  } catch (error) {
    console.error('Error deleting beneficiary:', error);
    res.status(500).json({ error: 'Failed to delete beneficiary' });
  }
});

module.exports = router;
