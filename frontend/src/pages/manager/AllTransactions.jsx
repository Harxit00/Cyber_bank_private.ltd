import React, { useEffect, useState } from 'react'
import manager from '../../services/manager.service'
import toast from 'react-hot-toast'

export default function AllTransactions() {
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
      const data = await manager.getAllTransactions()
      setTransactions(Array.isArray(data) ? data : data.transactions || [])
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

  if (loading) return <div className="p-8">Loading transactions...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Transactions</h1>

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

      {/* Table */}
      {filteredTransactions.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-center text-gray-500">
          <p>No transactions found</p>
        </div>
      ) : (
        <div className="p-4 bg-white rounded shadow overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Transactions ({filteredTransactions.length})</h2>
          <table className="w-full text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Customer ID</th>
                <th className="px-4 py-2 text-left">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{txn.date ? new Date(txn.date).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-2 font-semibold">${txn.amount?.toFixed(2) || '0.00'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      txn.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : txn.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{txn.type || 'N/A'}</td>
                  <td className="px-4 py-2 text-xs text-gray-500 font-mono">{txn.customerId || 'N/A'}</td>
                  <td className="px-4 py-2 text-xs text-gray-500 font-mono">{txn._id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
