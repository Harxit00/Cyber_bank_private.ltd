import api from './api'

export async function getAuditLogs() {
  const res = await api.get('/admin/audit-logs')
  return res.data
}

export async function getUsers() {
  const res = await api.get('/admin/users')
  // backend returns array of users (includes sensitive fields in this lab)
  return res.data
}

export async function updateUserRole(id, role) {
  const res = await api.put(`/admin/users/${id}`, { role })
  return res.data
}

// requested for AdminReports page
export async function getSystemReports() {
  const res = await api.get('/admin/reports')
  return res.data
}

export default { getAuditLogs, getUsers, updateUserRole, getSystemReports }
