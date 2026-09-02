import React, { useEffect, useState } from 'react'
import { Trash2, Plus, Users } from 'lucide-react'
import beneficiary from '../../services/beneficiary.service'
import toast from 'react-hot-toast'

export default function Beneficiaries() {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    accountNumber: '',
    bankName: '',
    bankCode: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchBeneficiaries()
  }, [])

  const fetchBeneficiaries = async () => {
    try {
      setLoading(true)
      const data = await beneficiary.getBeneficiaries()
      setBeneficiaries(data)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch beneficiaries')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddBeneficiary = async (e) => {
    e.preventDefault()
    if (!form.name || !form.accountNumber) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setSubmitting(true)
      await beneficiary.addBeneficiary(form)
      toast.success('Beneficiary added successfully')
      setForm({ name: '', accountNumber: '', bankName: '', bankCode: '' })
      setShowForm(false)
      fetchBeneficiaries()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to add beneficiary')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteBeneficiary = async (id) => {
    if (!window.confirm('Are you sure you want to delete this beneficiary?')) return

    try {
      await beneficiary.deleteBeneficiary(id)
      toast.success('Beneficiary deleted')
      fetchBeneficiaries()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to delete beneficiary')
    }
  }

  if (loading) return <div className="p-8">Loading beneficiaries...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Beneficiaries</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Beneficiary
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Add New Beneficiary</h2>
          <form onSubmit={handleAddBeneficiary} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Beneficiary name"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Account Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="accountNumber"
                value={form.accountNumber}
                onChange={handleChange}
                placeholder="0000000000"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Bank Name</label>
              <input
                type="text"
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                placeholder="Bank name"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Bank Code</label>
              <input
                type="text"
                name="bankCode"
                value={form.bankCode}
                onChange={handleChange}
                placeholder="Bank code"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Beneficiary'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {beneficiaries.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-center text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No beneficiaries added yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {beneficiaries.map((ben) => (
            <div key={ben._id} className="p-4 bg-white rounded shadow hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-lg">{ben.name}</p>
                </div>
                <button
                  onClick={() => handleDeleteBeneficiary(ben._id)}
                  className="text-red-600 hover:text-red-800 p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Account Number</p>
                  <p className="font-mono">{ben.accountNumber}</p>
                </div>
                {ben.bankName && (
                  <div>
                    <p className="text-gray-600">Bank</p>
                    <p>{ben.bankName}</p>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 pt-2 border-t mt-2">
                ID: {ben._id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
