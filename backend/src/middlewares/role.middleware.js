// VULN: Privilege Escalation — inconsistent RBAC enforcement across modules
// This middleware factory checks req.user.role against allowedRoles
module.exports = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Forbidden: insufficient privileges' });
  }

  next();
};
