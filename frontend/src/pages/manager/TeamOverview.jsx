import React, { useEffect, useState } from 'react'
import { Users, TrendingUp } from 'lucide-react'
import manager from '../../services/manager.service'
import toast from 'react-hot-toast'

export default function TeamOverview() {
  const [team, setTeam] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeamData()
  }, [])

  const fetchTeamData = async () => {
    try {
      setLoading(true)
      const data = await manager.getTeam()
      setTeam(Array.isArray(data) ? data : data.employees || data.team || [])
      
      // Calculate basic stats
      if (Array.isArray(data) || data.employees) {
        const employees = Array.isArray(data) ? data : data.employees || []
        setStats({
          totalEmployees: employees.length,
          activeEmployees: employees.filter(e => e.status === 'active').length,
          inactiveEmployees: employees.filter(e => e.status !== 'active').length
        })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch team data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8">Loading team data...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Team Overview</h1>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold">{stats.totalEmployees}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500 opacity-50" />
            </div>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeEmployees}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500 opacity-50" />
            </div>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive</p>
                <p className="text-3xl font-bold text-red-600">{stats.inactiveEmployees}</p>
              </div>
              <Users className="w-10 h-10 text-red-500 opacity-50" />
            </div>
          </div>
        </div>
      )}

      {/* Team Table */}
      {team.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-center text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No team members found</p>
        </div>
      ) : (
        <div className="p-4 bg-white rounded shadow overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Employees</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Department</th>
                <th className="px-4 py-2 text-left">ID</th>
              </tr>
            </thead>
            <tbody>
              {team.map((employee) => (
                <tr key={employee._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 font-semibold">{employee.name || 'N/A'}</td>
                  <td className="px-4 py-2">{employee.email || 'N/A'}</td>
                  <td className="px-4 py-2">{employee.role || 'employee'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      employee.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {employee.status || 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-2">{employee.department || 'N/A'}</td>
                  <td className="px-4 py-2 text-xs text-gray-500 font-mono">{employee._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
