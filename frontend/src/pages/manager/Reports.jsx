import React, { useEffect, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import manager from '../../services/manager.service'
import toast from 'react-hot-toast'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function Reports() {
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const data = await manager.getReports()
      setReports(data)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch reports')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8">Loading reports...</div>

  if (!reports) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No report data available</p>
      </div>
    )
  }

  // Prepare chart data
  const transactionsByStatus = reports.transactionsByStatus || [
    { name: 'Completed', value: 0 },
    { name: 'Pending', value: 0 },
    { name: 'Failed', value: 0 }
  ]

  const transactionsByType = reports.transactionsByType || [
    { name: 'Transfer', value: 0 },
    { name: 'Deposit', value: 0 },
    { name: 'Withdrawal', value: 0 }
  ]

  const monthlyTransactions = reports.monthlyTransactions || [
    { month: 'Jan', amount: 0 },
    { month: 'Feb', amount: 0 },
    { month: 'Mar', amount: 0 }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Reports</h1>

      {/* Summary Stats */}
      {reports.summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Total Transactions</p>
            <p className="text-3xl font-bold">{reports.summary.totalTransactions || 0}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Total Volume</p>
            <p className="text-3xl font-bold text-green-600">${(reports.summary.totalVolume || 0).toFixed(2)}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Avg Transaction</p>
            <p className="text-3xl font-bold">${(reports.summary.avgTransaction || 0).toFixed(2)}</p>
          </div>
          <div className="p-4 bg-white rounded shadow">
            <p className="text-sm text-gray-600">Active Customers</p>
            <p className="text-3xl font-bold">{reports.summary.activeCustomers || 0}</p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transactions by Status */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Transactions by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={transactionsByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {transactionsByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Transactions by Type */}
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Transactions by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionsByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Transactions */}
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Monthly Transaction Volume</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyTransactions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
