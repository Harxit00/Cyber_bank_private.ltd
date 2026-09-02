import api from './api'

export async function getTickets() {
  const res = await api.get('/employee/tickets')
  return res.data
}

export async function updateTicket(id, data) {
  // backend may not implement PUT for tickets, but pages import this name — call the expected route
  const res = await api.put(`/employee/tickets/${id}`, data)
  return res.data
}

export async function lookupTransaction(id) {
  const res = await api.get(`/employee/transactions/${id}`)
  // backend returns { transaction } or transaction directly
  return res.data.transaction || res.data
}

export async function lookupCustomer(query) {
  const res = await api.get('/employee/customers', { params: { search: query } })
  // backend returns { customers, count } or array — normalize to array
  return res.data.customers || res.data
}

export default { getTickets, updateTicket, lookupTransaction, lookupCustomer }
