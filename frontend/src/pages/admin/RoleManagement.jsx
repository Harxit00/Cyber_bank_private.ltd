import React, { useEffect, useState } from 'react'
import admin from '../../services/admin.service'
import toast from 'react-hot-toast'

const ROLE_DESCRIPTIONS = {
  customer: 'Bank customers who can view accounts and make payments.',
  employee: 'Support/operations staff who can lookup customers and tickets.',
  manager: 'Managers who can view team and system reports.',
  admin: 'Administrators with full system access.'
}

export default function RoleManagement() {
  const [usersByRole, setUsersByRole] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await admin.getUsers()
      const users = Array.isArray(data) ? data : data.users || []
      const grouped = users.reduce((acc, u) => {
        const r = u.role || 'unknown'
        acc[r] = acc[r] || []
        acc[r].push(u)
        return acc
      }, {})
      setUsersByRole(grouped)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8">Loading roles...</div>

  const roles = Object.keys(ROLE_DESCRIPTIONS)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Role Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map(role => (
          <div key={role} className="p-4 bg-white rounded shadow">
            <h2 className="text-lg font-semibold">{role} ({(usersByRole[role] || []).length})</h2>
            <p className="text-sm text-gray-600 mb-3">{ROLE_DESCRIPTIONS[role]}</p>

            <div className="space-y-2">
              {(usersByRole[role] || []).map(u => (
                <div key={u._id} className="p-2 border rounded">
                  <p className="font-semibold">{u.name || u.email || u._id}</p>
                  <p className="text-xs text-gray-500">ID: {u._id}</p>
                </div>
              ))}

              {(!usersByRole[role] || usersByRole[role].length === 0) && (
                <p className="text-sm text-gray-500">No users with this role</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
