import React, { useEffect, useState } from 'react'
import { User, Upload } from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function Profile() {
  const { token } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({})
  const [kycFile, setKycFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // In a real app, fetch profile from backend
    // For now, show a placeholder
    setProfile({
      _id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1-234-567-8900',
      address: '123 Main St, City, State 12345',
      kycStatus: 'pending'
    })
    setForm({
      name: 'John Doe',
      phone: '+1-234-567-8900',
      address: '123 Main St, City, State 12345'
    })
    setLoading(false)
  }, [token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    setKycFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)

      // Upload KYC if file selected
      if (kycFile) {
        const formData = new FormData()
        formData.append('file', kycFile)

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:4000/api'}/customer/upload-kyc`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          }
        )

        if (!response.ok) {
          throw new Error('KYC upload failed')
        }

        toast.success('KYC uploaded successfully')
        setKycFile(null)
      }

      // Update profile in real scenario
      toast.success('Profile updated')
      setEditing(false)
    } catch (error) {
      toast.error(error.message || 'Failed to update profile')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8">Loading profile...</div>
  if (!profile) return <div className="p-8">Profile not found</div>

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">My Profile</h1>

      {/* Profile Info Card */}
      <div className="p-6 bg-white rounded shadow">
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </h2>
          <button
            onClick={() => setEditing(!editing)}
            className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={form.name || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email (Read-only)</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full border border-gray-300 p-3 rounded bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={form.phone || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Address</label>
              <textarea
                name="address"
                value={form.address || ''}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-semibold">{profile.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p>{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p>{profile.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p>{profile.address}</p>
            </div>
            <div className="pt-2 border-t">
              <p className="text-xs text-gray-500">ID: {profile._id}</p>
            </div>
          </div>
        )}
      </div>

      {/* KYC Upload */}
      <div className="p-6 bg-white rounded shadow">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          KYC Verification
        </h2>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">Current Status</p>
            <span
              className={`inline-block px-3 py-1 rounded text-sm font-semibold ${
                profile.kycStatus === 'verified'
                  ? 'bg-green-100 text-green-800'
                  : profile.kycStatus === 'pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {profile.kycStatus}
            </span>
          </div>

          {profile.kycStatus !== 'verified' && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Upload KYC Document (PDF, JPG, PNG)
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {kycFile && (
                <p className="text-sm text-green-600">
                  Selected: {kycFile.name}
                </p>
              )}
              <button
                type="submit"
                disabled={submitting || !kycFile}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold disabled:opacity-50"
              >
                {submitting ? 'Uploading...' : 'Upload KYC'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
