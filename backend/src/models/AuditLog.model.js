const mongoose = require('mongoose');

const AuditLogSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  action: String,
  ip: String,
  timestamp: { type: Date, default: Date.now },
  meta: mongoose.Schema.Types.Mixed
});

module.exports = mongoose.model('AuditLog', AuditLogSchema);
