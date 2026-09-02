const express = require('express');
const authController = require('../controllers/auth.controller');
const accountController = require('../controllers/account.controller');
const transactionController = require('../controllers/transaction.controller');
const supportController = require('../controllers/supportTicket.controller');
const adminController = require('../controllers/admin.controller');
const employeeController = require('../controllers/employee.controller');
const managerController = require('../controllers/manager.controller');
const paymentController = require('../controllers/payment.controller');
const beneficiaryController = require('../controllers/beneficiary.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');

const router = express.Router();

router.use('/auth', authController);

// Protected routes
router.use('/accounts', authMiddleware, roleMiddleware(['customer', 'admin']), accountController);
router.use('/transactions', authMiddleware, transactionController);
router.use('/support', authMiddleware, supportController);
router.use('/admin', authMiddleware, roleMiddleware(['admin']), adminController);

// Employee routes — authMiddleware only, NO role check (preserves BAC vulnerability)
router.use('/employee', authMiddleware, employeeController);

// Manager routes — authMiddleware only, NO role check (preserves privilege escalation vulnerability)
// VULN: Privilege Escalation — inconsistent RBAC enforcement
router.use('/manager', authMiddleware, managerController);

// Payment routes — authMiddleware only
router.use('/payments', authMiddleware, paymentController);

// Beneficiary routes — authMiddleware only
router.use('/beneficiaries', authMiddleware, beneficiaryController);

module.exports = router;
