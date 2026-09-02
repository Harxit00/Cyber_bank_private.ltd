import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

export default function Sidebar(){
  const { userRole } = useAuth()

  // For realism: render many links, but frontend won't fully block access server-side
  const common = [
    { to: '/customer/dashboard', label: 'Dashboard', roles: ['customer'] },
    { to: '/employee/dashboard', label: 'Employee Dashboard', roles: ['employee'] },
    { to: '/manager/dashboard', label: 'Manager Dashboard', roles: ['manager'] },
    { to: '/admin/dashboard', label: 'Admin Dashboard', roles: ['admin'] },
  ]

  return (
    <aside className="w-64 bg-white border-r p-4">
      <div className="space-y-2">
        {common.map((item) => (
          <Link key={item.to} to={item.to} className={`block p-2 rounded hover:bg-blue-50 ${item.roles.includes(userRole) ? 'text-blue-600' : 'text-gray-500'}`}>
            {item.label}
          </Link>
        ))}
        {/* Note: do not hide admin links from other users by design as per lab realism */}
        <div className="mt-6 text-xs text-gray-400">Role: {userRole}</div>
      </div>
    </aside>
  )
}
