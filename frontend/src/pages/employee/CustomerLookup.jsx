import React, { useEffect, useState } from 'react'
import { Search, User } from 'lucide-react'
import employee from '../../services/employee.service'
import toast from 'react-hot-toast'

export default function CustomerLookup() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const data = await employee.lookupCustomer(query)
      // data may be { customers } or array
      setResults(Array.isArray(data) ? data : data.customers || [])
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Lookup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Lookup</h1>
      </div>

      <form onSubmit={handleSearch} className="p-4 bg-white rounded shadow flex gap-2">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, phone or id"
            className="w-full p-3 border border-gray-200 rounded focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {loading && <div className="p-6">Searching customers...</div>}

      {!loading && results.length === 0 && (
        <div className="p-6 bg-white rounded shadow text-center text-gray-500">
          <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No customers found</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((c) => (
            <div key={c._id || c.id || Math.random()} className="p-4 bg-white rounded shadow hover:shadow-lg transition">
              <div className="mb-2">
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold text-lg">{c.name}</p>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Email</p>
                  <p>{c.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p>{c.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Accounts</p>
                  <pre className="font-mono text-xs bg-gray-100 p-2 rounded">{JSON.stringify(c.accounts || c.accountSummary || {}, null, 2)}</pre>
                </div>
              </div>

              <div className="text-xs text-gray-500 pt-2 border-t mt-2">
                Internal ID: {c._id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
