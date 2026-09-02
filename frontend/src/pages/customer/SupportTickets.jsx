import React, { useEffect, useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import supportTicket from '../../services/supportTicket.service'
import toast from 'react-hot-toast'

export default function SupportTickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const data = await supportTicket.getTickets()
      setTickets(data)
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch tickets')
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.subject || !form.message) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      setSubmitting(true)
      await supportTicket.createTicket({
        subject: form.subject,
        message: form.message
      })
      toast.success('Support ticket created')
      setForm({ subject: '', message: '' })
      setShowForm(false)
      fetchTickets()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to create ticket')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8">Loading tickets...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Support Tickets</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
        >
          <Send className="w-5 h-5" />
          Raise Ticket
        </button>
      </div>

      {/* New Ticket Form */}
      {showForm && (
        <div className="p-6 bg-white rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Raise a Support Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Subject <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Brief issue title"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Message <span className="text-red-600">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Describe your issue in detail..."
                rows="5"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Create Ticket'}
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

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-center text-gray-500">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No support tickets yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="p-6 bg-white rounded shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm text-gray-600">Subject</p>
                  <p className="text-xl font-semibold">{ticket.subject}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    ticket.status === 'open'
                      ? 'bg-blue-100 text-blue-800'
                      : ticket.status === 'in-progress'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

              <div className="mb-3 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                <p className="text-sm text-gray-600 mb-1">Your message:</p>
                {/* VULN-FE: stored XSS render */}
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: ticket.message }}
                />
              </div>

              {ticket.reply && (
                <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 mb-1">Support response:</p>
                  {/* VULN-FE: stored XSS render */}
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: ticket.reply }}
                  />
                </div>
              )}

              <div className="text-xs text-gray-500 pt-3 border-t mt-3">
                ID: {ticket._id} | Created: {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
