import React, { useState } from 'react'
import { Search, Eye } from 'lucide-react'
import employee from '../../services/employee.service'
import toast from 'react-hot-toast'

export default function TransactionLookup() {
  const [transactionId, setTransactionId] = useState('')
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!transactionId.trim()) {
      toast.error('Please enter a transaction ID')
      return
    }

    setLoading(true)
    try {
      const data = await employee.lookupTransaction(transactionId)
      setTransaction(data)
      setSearched(true)
      toast.success('Transaction found')
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Transaction not found')
      setTransaction(null)
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Transaction Lookup</h1>

      {/* Search Form */}
      <div className="p-6 bg-white rounded shadow">
        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Transaction ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="Enter transaction ID..."
                className="flex-1 border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold flex items-center gap-2 disabled:opacity-50"
              >
                <Search className="w-5 h-5" />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Transaction Details */}
      {searched && (
        <>
          {transaction ? (
            <div className="p-6 bg-white rounded shadow space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Transaction Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <p className="font-mono font-semibold">{transaction._id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-semibold">
                    {transaction.date ? new Date(transaction.date).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-semibold text-green-600">${transaction.amount?.toFixed(2) || '0.00'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className={`font-semibold ${
                    transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {transaction.status || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="font-semibold">{transaction.type || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Customer ID</p>
                  <p className="font-mono text-sm">{transaction.customerId || 'N/A'}</p>
                </div>
                {transaction.remarks && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Remarks</p>
                    <p className="text-sm">{transaction.remarks}</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 bg-white rounded shadow text-center text-gray-500">
              <p>No transaction found with the provided ID</p>
              <p className="text-sm mt-2">Note: This demonstrates IDOR vulnerability - employees can look up any transaction</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
