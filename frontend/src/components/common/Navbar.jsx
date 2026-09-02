import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function Navbar(){
  const { token, userRole, logout } = useAuth()
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link to="/home" className="text-2xl font-bold text-blue-600">CyberBank</Link>
          <span className="text-sm text-gray-500 hidden md:inline">Pvt. Ltd.</span>
        </div>
        <div className="flex items-center space-x-4">
          {!token && (
            <>
              <Link to="/login" className="text-blue-600">Login</Link>
              <Link to="/register" className="text-gray-600">Register</Link>
            </>
          )}
          {token && (
            <>
              <span className="text-gray-700">{userRole || 'User'}</span>
              <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
