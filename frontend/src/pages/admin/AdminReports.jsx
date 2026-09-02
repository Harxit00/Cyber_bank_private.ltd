import React, { useEffect, useState } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import admin from '../../services/admin.service'
import toast from 'react-hot-toast'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export default function AdminReports() {
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const data = await admin.getSystemReports()
      // normalize: backend may return { reports: {...} } or raw object
      setReports(data.reports || data)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to fetch admin reports')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8">Loading admin reports...</div>
  if (!reports) return <div className="p-8 text-gray-500">No report data available</div>

  const transactionsByStatus = reports.transactionsByStatus || [{ name: 'Completed', value: 0 }]
  const transactionsByType = reports.transactionsByType || [{ name: 'Transfer', value: 0 }]
  const monthly = reports.monthlyTransactions || []

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin — System Reports</h1>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Transactions by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={transactionsByStatus} dataKey="value" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                {transactionsByStatus.map((entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

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

      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Monthly Transaction Volume</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthly}>
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
