import axios from 'axios'
import { getToken, logout } from './auth.service'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to attach JWT
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers = config.headers || {}
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
}, (error) => Promise.reject(error))

// Response interceptor to handle 401
api.interceptors.response.use((res) => res, (error) => {
  if (error.response && error.response.status === 401) {
    // auto logout or redirect
    try { logout() } catch (e) {}
    // allow calling code to handle navigation
  }
  return Promise.reject(error)
})

export default api
