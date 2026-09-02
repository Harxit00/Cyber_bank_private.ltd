import React, { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import transaction from '../../services/transaction.service'
import toast from 'react-hot-toast'

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    minAmount: '',
    maxAmount: ''
  })

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const data = await transaction.getTransactions()
      setTransactions(data)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch transactions')
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

  const filteredTransactions = transactions.filter((txn) => {
    if (filters.status && txn.status !== filters.status) return false
    if (filters.minAmount && txn.amount < parseFloat(filters.minAmount)) return false
    if (filters.maxAmount && txn.amount > parseFloat(filters.maxAmount)) return false
    return true
  })

  const chartData = filteredTransactions
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((txn) => ({
      date: new Date(txn.date).toLocaleDateString(),
      amount: txn.amount
    }))

  if (loading) return <div className="p-8">Loading transactions...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transaction History</h1>

      {/* Filters */}
      <div className="p-4 bg-white rounded shadow">
        <h2 className="font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 p-2 rounded text-sm"
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Min Amount</label>
            <input
              type="number"
              name="minAmount"
              value={filters.minAmount}
              onChange={handleFilterChange}
              placeholder="0"
              className="w-full border border-gray-300 p-2 rounded text-sm"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Max Amount</label>
            <input
              type="number"
              name="maxAmount"
              value={filters.maxAmount}
              onChange={handleFilterChange}
              placeholder="999999"
              className="w-full border border-gray-300 p-2 rounded text-sm"
            />
          </div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-semibold mb-4">Amount Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      <div className="p-4 bg-white rounded shadow overflow-x-auto">
        <h2 className="font-semibold mb-4">Transactions ({filteredTransactions.length})</h2>
        {filteredTransactions.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No transactions found</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 font-semibold">${txn.amount?.toFixed(2) || '0.00'}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        txn.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : txn.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{txn.type}</td>
                  <td className="px-4 py-2 text-xs text-gray-500 font-mono">{txn._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
