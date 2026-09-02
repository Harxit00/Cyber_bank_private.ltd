const express = require('express');
const router = express.Router();
const { Payment, Transaction, Account, AuditLog } = require('../models');

// POST / — create a payment
router.post('/', async (req, res) => {
  try {
    const { from_account, to_account, beneficiary, amount, remarks } = req.body;

    // Create payment record
    const payment = await Payment.create({
      customer_id: req.user._id,
      from_account,
      to_account: to_account || beneficiary,
      amount,
      remarks,
      status: 'pending',
    });

    // Create matching transaction
    const transaction = await Transaction.create({
      customer_id: req.user._id,
      payment_id: payment._id,
      from_account,
      to_account: to_account || beneficiary,
      amount,
      type: 'transfer',
      status: 'pending',
      description: remarks,
    });

    // Audit log
    try {
      await AuditLog.create({
        user_id: req.user._id,
        action: `Created payment ${payment._id}`,
        ip: req.ip,
      });
    } catch (auditError) {
      console.error('Audit log error:', auditError);
    }

    res.status(201).json({ payment, transaction });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// GET /:id — get single payment by id
// VULN: Broken Access Control / IDOR — no check that payment.customer_id === req.user._id
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).lean();
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.json({ payment });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// GET / — list payments for logged-in customer
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find({ customer_id: req.user._id }).lean();
    res.json({ payments, count: payments.length });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

module.exports = router;
