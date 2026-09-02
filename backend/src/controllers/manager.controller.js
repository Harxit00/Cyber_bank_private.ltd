const express = require('express');
const router = express.Router();
const { Transaction, User, AuditLog, Payment, SupportTicket } = require('../models');

// GET /team — list of employees with basic stats
router.get('/team', async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' })
      .select('_id name email phone createdAt')
      .lean();

    const enrichedEmployees = await Promise.all(
      employees.map(async (emp) => {
        const ticketsHandled = await SupportTicket.countDocuments();
        const transactionsReviewed = await Transaction.countDocuments();
        return {
          ...emp,
          ticketsHandled,
          transactionsReviewed,
        };
      })
    );

    res.json({ employees: enrichedEmployees, count: enrichedEmployees.length });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// GET /transactions — ALL transactions across all customers (team-wide)
// VULN: Privilege Escalation — only checks JWT validity, NOT req.user.role === 'manager'
router.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find().lean();
    res.json({ transactions, count: transactions.length });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// GET /reports — aggregate stats
// VULN: Privilege Escalation — only checks JWT validity, NOT req.user.role === 'manager'
router.get('/reports', async (req, res) => {
  try {
    const pipeline = [
      {
        $facet: {
          totalTransactions: [
            { $count: 'count' },
          ],
          totalAmount: [
            { $group: { _id: null, total: { $sum: '$amount' } } },
          ],
          byStatus: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
          ],
          approvalRate: [
            {
              $group: {
                _id: null,
                approved: {
                  $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] },
                },
                total: { $sum: 1 },
              },
            },
            {
              $project: {
                _id: 0,
                approvalRate: {
                  $multiply: [{ $divide: ['$approved', '$total'] }, 100],
                },
              },
            },
          ],
        },
      },
    ];

    const reports = await Transaction.aggregate(pipeline);

    res.json({ reports: reports[0] || {} });
  } catch (error) {
    console.error('Error generating reports:', error);
    res.status(500).json({ error: 'Failed to generate reports' });
  }
});

// PUT /requests/:id/approve — approve pending transactions
// VULN: Privilege Escalation — only checks JWT validity, NOT req.user.role === 'manager'
router.put('/requests/:id/approve', async (req, res) => {
  try {
    const { remarks } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', approvedBy: req.user._id, approvalRemarks: remarks },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Audit log
    try {
      await AuditLog.create({
        user_id: req.user._id,
        action: `Approved transaction ${req.params.id}`,
        ip: req.ip,
      });
    } catch (auditError) {
      console.error('Audit log error:', auditError);
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Error approving transaction:', error);
    res.status(500).json({ error: 'Failed to approve transaction' });
  }
});

// PUT /requests/:id/reject — reject pending transactions
// VULN: Privilege Escalation — only checks JWT validity, NOT req.user.role === 'manager'
router.put('/requests/:id/reject', async (req, res) => {
  try {
    const { reason } = req.body;
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectedBy: req.user._id, rejectionReason: reason },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    // Audit log
    try {
      await AuditLog.create({
        user_id: req.user._id,
        action: `Rejected transaction ${req.params.id}`,
        ip: req.ip,
      });
    } catch (auditError) {
      console.error('Audit log error:', auditError);
    }

    res.json({ transaction });
  } catch (error) {
    console.error('Error rejecting transaction:', error);
    res.status(500).json({ error: 'Failed to reject transaction' });
  }
});

module.exports = router;
