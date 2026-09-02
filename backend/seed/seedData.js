// Seed script for CyberBank (intentionally simple / vulnerable)
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');
const User = require('../src/models/User.model');
const Account = require('../src/models/Account.model');
const Transaction = require('../src/models/Transaction.model');
const Payment = require('../src/models/Payment.model');
const Beneficiary = require('../src/models/Beneficiary.model');

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cyberbank_vuln';
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '4', 10);

async function main() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to DB for seeding');

  await Promise.all([User.deleteMany({}), Account.deleteMany({}), Transaction.deleteMany({}), Payment.deleteMany({}), Beneficiary.deleteMany({})]);

  const users = [];

  // 100 customers
  for (let i = 0; i < 100; i++) {
    const password = 'Password123!'; // VULN: weak/password reuse for seed
    const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const u = await User.create({ name: faker.person.fullName(), email: faker.internet.email(), password: hashed, role: 'customer' });
    users.push(u);
  }

  // 10 employees
  for (let i = 0; i < 10; i++) {
    const password = 'EmpPass123!';
    const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const u = await User.create({ name: faker.person.fullName(), email: `employee${i}@cyberbank.local`, password: hashed, role: 'employee' });
    users.push(u);
  }

  // 2 managers
  for (let i = 0; i < 2; i++) {
    const password = 'Manager123!';
    const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const u = await User.create({ name: faker.person.fullName(), email: `manager${i}@cyberbank.local`, password: hashed, role: 'manager' });
    users.push(u);
  }

  // 1 admin
  {
    const password = 'Admin123!';
    const hashed = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    const u = await User.create({ name: 'Admin User', email: 'admin@cyberbank.local', password: hashed, role: 'admin' });
    users.push(u);
  }

  // Accounts and transactions
  const accounts = [];
  for (let u of users.filter(x => x.role === 'customer')) {
    const accountsCount = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < accountsCount; i++) {
      const acc = await Account.create({ customer_id: u._id, account_number: faker.finance.account(10), type: faker.helpers.arrayElement(['savings','current']), balance: faker.number.int({ min: 0, max: 100000 }) });
      accounts.push(acc);
    }
  }

  // Random transactions
  for (let i = 0; i < 200; i++) {
    const from = faker.helpers.arrayElement(accounts);
    const to = faker.helpers.arrayElement(accounts);
    const amount = faker.number.int({ min: 1, max: 5000 });
    await Transaction.create({ from_account: from._id, to_account: to._id, amount, status: 'completed', remarks: faker.lorem.sentence() });
  }

  console.log('Seeding complete');
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
