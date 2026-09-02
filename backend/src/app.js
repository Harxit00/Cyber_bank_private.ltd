const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const db = require('./config/db');
const routes = require('./routes/index');
const AuditLog = require('./models/AuditLog.model');

require('dotenv').config();

const app = express();

// VULN: CORS wide open
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads publicly - VULN: insecure file upload exposure
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Debug/status exposing env - VULN: Security Misconfiguration
app.get('/debug', (req, res) => {
  res.json({ env: process.env, node: process.version });
});

// Insecure file upload route - no file restrictions - VULN: Insecure File Upload
const upload = multer({ dest: path.join(__dirname, 'uploads/') });
app.post('/api/customer/upload-kyc', upload.single('file'), async (req, res) => {
  try {
    // store file directly
    await AuditLog.create({ user_id: req.body.user_id || null, action: 'upload_kyc', ip: req.ip, meta: { file: req.file } });
    res.json({ uploaded: req.file });
  } catch (err) {
    res.status(500).json({ error: err.stack });
  }
});

// Attach API routes
app.use('/api', routes);

// Global error handler (verbose) - VULN: Verbose errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message, stack: err.stack });
});

// Connect DB
db.connect();

module.exports = app;
