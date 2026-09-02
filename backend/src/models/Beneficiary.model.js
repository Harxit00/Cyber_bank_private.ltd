const mongoose = require('mongoose');

const BeneficiarySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  account_number: String,
  bank: String
});

module.exports = mongoose.model('Beneficiary', BeneficiarySchema);
