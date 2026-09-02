const mongoose = require('mongoose');

const SupportTicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  subject: String,
  message: String, // VULN: XSS - stored raw
  status: { type: String, enum: ['open','in_progress','closed'], default: 'open' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SupportTicket', SupportTicketSchema);
