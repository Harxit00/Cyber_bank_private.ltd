import api from './api'

export async function getTransactions() {
  const res = await api.get('/transactions')
  // backend shapes vary; try to return transactions array if present
  return res.data.transactions || res.data
}

export default { getTransactions }
