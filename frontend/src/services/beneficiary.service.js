import api from './api'

export async function getBeneficiaries() {
  const res = await api.get('/beneficiaries')
  // backend returns { beneficiaries, count } — return array for pages that expect it
  return res.data.beneficiaries || res.data
}

export async function addBeneficiary(data) {
  const res = await api.post('/beneficiaries', data)
  return res.data
}

export async function deleteBeneficiary(id) {
  const res = await api.delete(`/beneficiaries/${id}`)
  return res.data
}

export default { getBeneficiaries, addBeneficiary, deleteBeneficiary }
