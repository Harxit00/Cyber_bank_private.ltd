# CyberBank Pvt. Ltd. - Vulnerable Backend

This repository contains an intentionally vulnerable Node.js + Express + MongoDB backend used for authorized internal security testing and training (DVWA/OWASP-style lab). Do NOT run this on production networks.

Vulnerabilities (explicitly included) and where they exist

1. Weak Authentication / Brute Force
   - Endpoint: POST /api/auth/login
   - Details: No rate limiting or account lockouts. Weak password policy during registration.
   - Fix: Add rate limiting (e.g., express-rate-limit), account lockouts, and enforce strong password rules.

2. NoSQL Injection
   - Endpoint: POST /api/transactions/reports
   - Details: Raw req.body/query is used to build MongoDB queries directly.
   - Fix: Validate and sanitize query parameters and use safe query builders or whitelists.

3. Broken Access Control / IDOR
   - Endpoints: GET /api/accounts/:id and GET /api/transactions/:id
   - Details: These endpoints do not verify ownership — any authenticated user can fetch arbitrary records.
   - Fix: Verify resource ownership or check roles/permissions before returning records.

4. Cross-Site Scripting (XSS)
   - Fields: SupportTicket.message, Transaction.remarks
   - Endpoints: POST /api/support, POST /api/transactions
   - Details: User input stored and returned raw.
   - Fix: Sanitize/escape HTML in input and output encoding in front-end.

5. Privilege Escalation
   - Endpoints: POST /api/auth/register and profile update paths
   - Details: The `role` field is accepted from client input, allowing customers to set role: "admin".
   - Fix: Assign roles server-side only and validate role changes.

6. Security Misconfiguration
   - Features: /debug route exposes env, verbose error messages returned
   - Fix: Remove debug endpoints, hide stack traces in production, and follow secure configuration.

7. Weak Session Management
   - Details: JWT expiry set to 7 days, no refresh/blacklist, no logout invalidation
   - Fix: Implement short-lived tokens, refresh tokens, and token revocation/blacklist.

8. Insecure File Upload
   - Endpoint: POST /api/customer/upload-kyc
   - Details: Accepts any file types and stores them in a public folder with no size/type checks.
   - Fix: Validate file types, limit sizes, scan for malware, and store outside webroot.

9. Sensitive Data Exposure
   - Endpoint: GET /api/admin/users (and Register/Login responses)
   - Details: Password hashes and internal IDs are returned in API responses.
   - Fix: Never return password hashes or sensitive fields; use DTOs that omit secrets.

10. Outdated / Insecure Practices
   - Details: bcrypt salt rounds set to 4, sensitive data logged (request bodies, passwords)
   - Fix: Use bcrypt >= 10 rounds, avoid logging sensitive data, and follow current crypto best practices.

How to run (development)

1. Ensure MongoDB is running locally.
2. Create a .env file with MONGODB_URI, JWT_SECRET, and other values.
3. npm install
4. npm run seed
5. npm run start

Seed data creates ~100 customers, 10 employees, 2 managers, and 1 admin along with accounts and transactions.

Notes

- All vulnerabilities are intentionally left in place and annotated with comments in code (// VULN: ...). This code is for testing only.
