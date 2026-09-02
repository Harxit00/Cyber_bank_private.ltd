import React, { useEffect, useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'
import employee from '../../services/employee.service'
import toast from 'react-hot-toast'

export default function SupportTicketHandling() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [replyingTo, setReplyingTo] = useState(null)
  const [form, setForm] = useState({
    reply: '',
    status: ''
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTickets()
  }, [])

  const fetchTickets = async () => {
    try {
      setLoading(true)
      const data = await employee.getTickets()
      setTickets(Array.isArray(data) ? data : data.tickets || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleReplyChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleUpdateTicket = async (ticketId) => {
    if (!form.reply.trim() && !form.status) {
      toast.error('Please provide a reply or update status')
      return
    }

    try {
      setSubmitting(true)
      await employee.updateTicket(ticketId, {
        reply: form.reply || undefined,
        status: form.status || undefined
      })
      toast.success('Ticket updated successfully')
      setForm({ reply: '', status: '' })
      setReplyingTo(null)
      fetchTickets()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to update ticket')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8">Loading tickets...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Support Ticket Handling</h1>

      {tickets.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-center text-gray-500">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No support tickets to handle</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket._id} className="p-6 bg-white rounded shadow space-y-4">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Subject</p>
                  <p className="text-xl font-semibold">{ticket.subject}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-semibold ${
                  ticket.status === 'open'
                    ? 'bg-blue-100 text-blue-800'
                    : ticket.status === 'in-progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {ticket.status || 'open'}
                </span>
              </div>

              {/* Customer Message */}
              <div className="p-3 bg-gray-50 rounded border-l-4 border-blue-500">
                <p className="text-sm text-gray-600 mb-1">Customer message:</p>
                {/* VULN-FE: stored XSS render */}
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{ __html: ticket.message }}
                />
              </div>

              {/* Existing Reply */}
              {ticket.reply && (
                <div className="p-3 bg-green-50 rounded border-l-4 border-green-500">
                  <p className="text-sm text-gray-600 mb-1">Your reply:</p>
                  {/* VULN-FE: stored XSS render */}
                  <div
                    className="text-sm"
                    dangerouslySetInnerHTML={{ __html: ticket.reply }}
                  />
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === ticket._id ? (
                <div className="p-4 bg-blue-50 rounded border border-blue-300 space-y-3">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Reply</label>
                    <textarea
                      name="reply"
                      value={form.reply}
                      onChange={handleReplyChange}
                      placeholder="Type your response..."
                      rows="3"
                      className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Status</label>
                    <select
                      name="status"
                      value={form.status}
                      onChange={handleReplyChange}
                      className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Keep current status</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateTicket(ticket._id)}
                      disabled={submitting}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold disabled:opacity-50"
                    >
                      {submitting ? 'Updating...' : 'Update Ticket'}
                    </button>
                    <button
                      onClick={() => {
                        setReplyingTo(null)
                        setForm({ reply: '', status: '' })
                      }}
                      className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyingTo(ticket._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                >
                  <Send className="w-4 h-4" />
                  Reply
                </button>
              )}

              <div className="text-xs text-gray-500 pt-3 border-t">
                ID: {ticket._id} | Customer: {ticket.customerId || 'N/A'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
