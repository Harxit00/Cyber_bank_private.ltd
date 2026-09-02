const express = require('express');
const router = express.Router();
const { Transaction, Account, SupportTicket, AuditLog, User } = require('../models');

// GET /me/tasks — placeholder assigned tasks
router.get('/me/tasks', async (req, res) => {
  try {
    // Mock static tasks for this employee
    const tasks = [
      {
        id: 'task-001',
        title: 'Review customer KYC documents',
        customer: 'John Doe',
        status: 'pending',
        priority: 'high',
        assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'task-002',
        title: 'Follow up on pending transaction #TXN-5678',
        customer: 'Jane Smith',
        status: 'in-progress',
        priority: 'medium',
        assignedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'task-003',
        title: 'Resolve support ticket #SUP-234',
        customer: 'Bob Johnson',
        status: 'pending',
        priority: 'medium',
        assignedAt: new Date(),
      },
    ];
    res.json({ tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET /customers — list all customers (employee can view, read-only)
router.get('/customers', async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('_id name email phone createdAt').lean();
    res.json({ customers, count: customers.length });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// GET /customers/:id — lookup single customer
// VULN: Broken Access Control — no ownership/ID validation
router.get('/customers/:id', async (req, res) => {
  try {
    const customer = await User.findById(req.params.id).lean();
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ customer });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// GET /transactions/:id — transaction lookup
// VULN: Broken Access Control — no ownership/ID validation, employee can fetch ANY transaction
router.get('/transactions/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id).lean();
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ transaction });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

// GET /tickets — list support tickets
router.get('/tickets', async (req, res) => {
  try {
    const tickets = await SupportTicket.find().lean();
    res.json({ tickets, count: tickets.length });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// PUT /tickets/:id — update ticket status/reply
router.put('/tickets/:id', async (req, res) => {
  try {
    const { status, reply } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (reply) updateData.reply = reply;

    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Audit log
    try {
      await AuditLog.create({
        user_id: req.user._id,
        action: `Updated support ticket ${req.params.id}`,
        ip: req.ip,
      });
    } catch (auditError) {
      console.error('Audit log error:', auditError);
    }

    res.json({ ticket });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
});

module.exports = router;
