import React, { useEffect, useState } from 'react'
import admin from '../../services/admin.service'
import toast from 'react-hot-toast'

const ROLE_OPTIONS = ['customer', 'employee', 'manager', 'admin']

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await admin.getUsers()
      setUsers(Array.isArray(data) ? data : data.users || [])
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (id, newRole) => {
    try {
      setSavingId(id)
      await admin.updateUserRole(id, newRole)
      toast.success('Role updated')
      // update local copy
      setUsers((prev) => prev.map(u => (u._id === id ? { ...u, role: newRole } : u)))
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update role')
    } finally {
      setSavingId(null)
    }
  }

  // Status toggle (lab: sensitive UI — we show and allow toggling locally)
  const toggleStatus = (id) => {
    setUsers((prev) => prev.map(u => (u._id === id ? { ...u, status: u.status === 'active' ? 'disabled' : 'active' } : u)))
    toast.success('Status toggled (client-side)')
  }

  if (loading) return <div className="p-8">Loading users...</div>

  if (users.length === 0) return <div className="p-8 text-gray-500">No users found</div>

  // Collect all keys present across users for full-field display (lab: show everything)
  const allKeys = Array.from(new Set(users.flatMap(u => Object.keys(u))))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">User Management</h1>

      <div className="overflow-auto bg-white rounded shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              {allKeys.map((k) => (
                <th key={k} className="px-4 py-2 text-left text-sm font-medium text-gray-600">{k}</th>
              ))}
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                {allKeys.map((k) => (
                  <td key={k} className="px-4 py-2 text-sm">
                    {/* show raw values (including sensitive hashes/ids) */}
                    {typeof u[k] === 'object' ? <pre className="text-xs font-mono">{JSON.stringify(u[k], null, 2)}</pre> : String(u[k])}
                  </td>
                ))}
                <td className="px-4 py-2 text-sm">
                  <select
                    value={u.role || ''}
                    onChange={(e) => handleRoleChange(u._1d, e.target.value)}
                    disabled={savingId === u._id}
                    className="border p-1 rounded mr-2"
                  >
                    {ROLE_OPTIONS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>

                  <button
                    onClick={() => toggleStatus(u._id)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    {u.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
