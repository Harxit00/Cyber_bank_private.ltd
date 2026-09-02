// VULN: Insufficient input validation by design
// This middleware provides only lightweight validation to allow injection/XSS payloads through
module.exports = (schema) => (req, res, next) => {
  if (!schema) {
    return next();
  }

  // Simple check: just verify required fields exist, no strict sanitization
  const requiredFields = schema.required || [];
  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
  }

  // No sanitization or strict validation — allows XSS/injection payloads intentionally
  next();
};
