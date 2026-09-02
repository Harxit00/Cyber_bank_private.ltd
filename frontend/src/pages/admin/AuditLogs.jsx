import React, { useEffect, useState } from 'react'
import { FileText, Search } from 'lucide-react'
import admin from '../../services/admin.service'
import toast from 'react-hot-toast'

export default function AuditLogs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    userId: '',
    action: ''
  })

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  const fetchAuditLogs = async () => {
    try {
      setLoading(true)
      const data = await admin.getAuditLogs()
      setLogs(Array.isArray(data) ? data : data.logs || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch audit logs')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const filteredLogs = logs.filter((log) => {
    if (filters.userId && log.userId !== filters.userId) return false
    if (filters.action && log.action !== filters.action) return false
    if (searchQuery && !(
      log.userId?.includes(searchQuery) ||
      log.action?.includes(searchQuery) ||
      log.ip?.includes(searchQuery)
    )) return false
    return true
  })

  const uniqueActions = [...new Set(logs.map(log => log.action).filter(Boolean))]
  const uniqueUserIds = [...new Set(logs.map(log => log.userId).filter(Boolean))]

  if (loading) return <div className="p-8">Loading audit logs...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="w-8 h-8" />
        <h1 className="text-3xl font-bold">Audit Logs</h1>
      </div>

      {/* Filters */}
      <div className="p-4 bg-white rounded shadow space-y-4">
        <h2 className="font-semibold">Filters & Search</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Search (User ID, Action, IP)</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter search term..."
              className="w-full border border-gray-300 p-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">User ID</label>
            <select
              name="userId"
              value={filters.userId}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 p-2 rounded text-sm"
            >
              <option value="">All Users</option>
              {uniqueUserIds.slice(0, 20).map(uid => (
                <option key={uid} value={uid}>{uid}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Action</label>
            <select
              name="action"
              value={filters.action}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 p-2 rounded text-sm"
            >
              <option value="">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      {filteredLogs.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-center text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No audit logs found</p>
        </div>
      ) : (
        <div className="p-4 bg-white rounded shadow overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Log Entries ({filteredLogs.length})</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Timestamp</th>
                <th className="px-4 py-2 text-left">User ID</th>
                <th className="px-4 py-2 text-left">Action</th>
                <th className="px-4 py-2 text-left">IP Address</th>
                <th className="px-4 py-2 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, idx) => (
                <tr key={`${log._id || idx}`} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2 text-xs font-mono">{log.userId || 'N/A'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      log.action === 'LOGIN' ? 'bg-blue-100 text-blue-800' :
                      log.action === 'LOGOUT' ? 'bg-gray-100 text-gray-800' :
                      log.action === 'CREATE' ? 'bg-green-100 text-green-800' :
                      log.action === 'UPDATE' ? 'bg-yellow-100 text-yellow-800' :
                      log.action === 'DELETE' ? 'bg-red-100 text-red-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs">{log.ip || 'N/A'}</td>
                  <td className="px-4 py-2 text-xs text-gray-600">{log.details || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
