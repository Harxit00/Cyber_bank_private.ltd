import React, { useEffect, useState } from 'react'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import manager from '../../services/manager.service'
import toast from 'react-hot-toast'

export default function ApproveRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionInProgress, setActionInProgress] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const data = await manager.getRequests()
      setRequests(Array.isArray(data) ? data : data.requests || [])
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to fetch requests')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (requestId) => {
    try {
      setActionInProgress(requestId)
      await manager.approveRequest(requestId)
      toast.success('Request approved successfully')
      fetchRequests()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to approve request')
    } finally {
      setActionInProgress(null)
    }
  }

  const handleReject = async (requestId) => {
    try {
      setActionInProgress(requestId)
      await manager.rejectRequest(requestId)
      toast.success('Request rejected')
      fetchRequests()
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to reject request')
    } finally {
      setActionInProgress(null)
    }
  }

  if (loading) return <div className="p-8">Loading requests...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Approval Requests</h1>

      {requests.length === 0 ? (
        <div className="p-6 bg-white rounded shadow text-center text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No pending requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="p-6 bg-white rounded shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-600">Request Type</p>
                  <p className="text-xl font-semibold">{request.type || 'N/A'}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-semibold flex items-center gap-1 ${
                  request.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : request.status === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {request.status === 'pending' && <Clock className="w-4 h-4" />}
                  {request.status === 'approved' && <CheckCircle className="w-4 h-4" />}
                  {request.status === 'rejected' && <XCircle className="w-4 h-4" />}
                  {request.status || 'pending'}
                </span>
              </div>

              {/* Request Details */}
              <div className="space-y-2 text-sm mb-4">
                {request.description && (
                  <div>
                    <p className="text-gray-600">Description</p>
                    <p>{request.description}</p>
                  </div>
                )}
                {request.amount && (
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-semibold">${request.amount.toFixed(2)}</p>
                  </div>
                )}
                {request.requestedBy && (
                  <div>
                    <p className="text-gray-600">Requested By</p>
                    <p>{request.requestedBy}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600">Submitted</p>
                  <p>{new Date(request.createdAt || request.submittedAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Action Buttons */}
              {request.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(request._id)}
                    disabled={actionInProgress === request._id}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {actionInProgress === request._id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    disabled={actionInProgress === request._id}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    {actionInProgress === request._id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              )}

              <div className="text-xs text-gray-500 pt-3 border-t">
                ID: {request._id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
