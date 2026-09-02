import React, { createContext, useState, useEffect } from 'react'
import { setToken as saveToken, getToken as readToken, logout as doLogout, decodeTokenRole } from '../services/auth.service'
import api from '../services/api'

export const AuthContext = createContext()

export function AuthProvider({ children }){
  const [token, setToken] = useState(() => readToken())
  const [userRole, setUserRole] = useState(() => decodeTokenRole(readToken()))
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setUserRole(decodeTokenRole(token))
  }, [token])

  const login = async (credentials) => {
    setLoading(true)
    try{
      const res = await api.post('/auth/login', credentials)
      const t = res.data.token
      saveToken(t)
      setToken(t)
      setUserRole(decodeTokenRole(t))
      setLoading(false)
      return res.data
    }catch(e){
      setLoading(false)
      throw e
    }
  }

  const logout = () => {
    doLogout()
    setToken(null)
    setUserRole(null)
  }

  return (
    <AuthContext.Provider value={{ token, userRole, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
