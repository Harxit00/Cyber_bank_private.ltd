import React, { useEffect, useState } from 'react'
import { Send } from 'lucide-react'
import payment from '../../services/payment.service'
import beneficiary from '../../services/beneficiary.service'
import toast from 'react-hot-toast'

export default function MakePayment() {
  const [beneficiaries, setBeneficiaries] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    beneficiaryId: '',
    amount: '',
    remarks: ''
  })

  useEffect(() => {
    fetchBeneficiaries()
  }, [])

  const fetchBeneficiaries = async () => {
    try {
      const data = await beneficiary.getBeneficiaries()
      setBeneficiaries(data)
    } catch (error) {
      toast.error('Failed to fetch beneficiaries')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.beneficiaryId || !form.amount) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      setLoading(true)
      await payment.createPayment({
        beneficiaryId: form.beneficiaryId,
        amount: parseFloat(form.amount),
        remarks: form.remarks
      })
      toast.success('Payment initiated successfully')
      setForm({ beneficiaryId: '', amount: '', remarks: '' })
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Payment failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Make Payment</h1>

      <div className="p-6 bg-white rounded shadow">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Beneficiary <span className="text-red-600">*</span>
            </label>
            <select
              name="beneficiaryId"
              value={form.beneficiaryId}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a beneficiary</option>
              {beneficiaries.map((ben) => (
                <option key={ben._id} value={ben._id}>
                  {ben.name} ({ben.accountNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Amount <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Remarks</label>
            <textarea
              name="remarks"
              value={form.remarks}
              onChange={handleChange}
              placeholder="Payment remarks (optional)"
              rows="3"
              className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
            {loading ? 'Processing...' : 'Send Payment'}
          </button>
        </form>
      </div>
    </div>
  )
}
