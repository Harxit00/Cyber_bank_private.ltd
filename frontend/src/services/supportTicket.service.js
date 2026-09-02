import api from './api'

export async function getTickets() {
  const res = await api.get('/support')
  // backend returns an array of tickets
  return res.data
}

export async function createTicket(data) {
  const res = await api.post('/support', data)
  return res.data
}

export default { getTickets, createTicket }
