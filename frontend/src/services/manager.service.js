import api from './api'

export async function getTeam() {
  const res = await api.get('/manager/team')
  // backend returns { employees, count } — return normalized data
  return res.data.employees || res.data
}

export async function getReports() {
  const res = await api.get('/manager/reports')
  // backend returns { reports: {...} }
  return res.data.reports || res.data
}

export async function getRequests() {
  const res = await api.get('/manager/requests')
  return res.data.requests || res.data
}

export async function approveRequest(id, data = {}) {
  const res = await api.put(`/manager/requests/${id}/approve`, data)
  return res.data
}

export async function rejectRequest(id, data = {}) {
  const res = await api.put(`/manager/requests/${id}/reject`, data)
  return res.data
}

export async function getAllTransactions() {
  const res = await api.get('/manager/transactions')
  return res.data.transactions || res.data
}

export default { getTeam, getReports, getRequests, approveRequest, rejectRequest, getAllTransactions }
