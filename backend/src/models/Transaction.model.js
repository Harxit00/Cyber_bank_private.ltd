const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  from_account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  to_account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
  amount: Number,
  status: { type: String, enum: ['pending','completed','failed'], default: 'pending' },
  txn_date: { type: Date, default: Date.now },
  remarks: String // VULN: XSS - stored and returned raw
});

module.exports = mongoose.model('Transaction', TransactionSchema);
