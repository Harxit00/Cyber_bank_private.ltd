const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  account_number: String,
  type: { type: String, enum: ['savings','current'], default: 'savings' },
  balance: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Account', AccountSchema);
