import api from './api'

export async function createPayment(data) {
  const res = await api.post('/payments', data)
  return res.data
}

export default { createPayment }
