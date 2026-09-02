const express = require('express');
const authController = require('../controllers/auth.controller');
const accountController = require('../controllers/account.controller');
const transactionController = require('../controllers/transaction.controller');
const supportController = require('../controllers/supportTicket.controller');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

router.use('/auth', authController);

// Protected routes
router.use('/accounts', authMiddleware, accountController);
router.use('/transactions', authMiddleware, transactionController);
router.use('/support', authMiddleware, supportController);
router.use('/admin', authMiddleware, adminController);

module.exports = router;
