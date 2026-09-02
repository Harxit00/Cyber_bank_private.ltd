import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

// allowedRoles: array of strings
export default function ProtectedRoute({ allowedRoles, children, redirectTo = '/login' }){
  const { token, userRole } = useAuth()

  if (!token) {
    return <Navigate to={redirectTo} replace />
  }
  if (allowedRoles && allowedRoles.length > 0){
    // allow if user's role is in allowedRoles (support both string or array)
    if (!allowedRoles.includes(userRole)){
      return <Navigate to="/unauthorized" replace />
    }
  }
  return children ? children : <Outlet />
}
