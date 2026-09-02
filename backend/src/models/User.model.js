const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // VULN: Sensitive data exposure - returned in APIs
  role: { type: String, enum: ['customer','employee','manager','admin'], default: 'customer' }, // VULN: Privilege Escalation - accepted from client
  status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
