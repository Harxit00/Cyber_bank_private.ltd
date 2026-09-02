import api from './api'

export async function login(credentials){
  const res = await api.post('/auth/login', credentials)
  return res.data
}

export function getToken(){
  return localStorage.getItem('cb_token')
}

export function setToken(token){
  localStorage.setItem('cb_token', token)
}

export function logout(){
  localStorage.removeItem('cb_token')
  localStorage.removeItem('cb_user')
}

export function decodeTokenRole(token){
  if (!token) return null
  try{
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.role || payload.roles || null
  }catch(e){
    return null
  }
}

export default { login, getToken, setToken, logout, decodeTokenRole }
