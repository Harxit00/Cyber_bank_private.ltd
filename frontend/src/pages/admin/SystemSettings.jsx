import React, { useEffect, useState } from 'react'
import { Settings, Save } from 'lucide-react'
import toast from 'react-hot-toast'

export default function SystemSettings() {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    apiTimeout: 30,
    maxLoginAttempts: 5,
    sessionTimeout: 3600,
    notificationsEnabled: true,
    auditLoggingEnabled: true,
    twoFactorRequired: false,
    minPasswordLength: 8
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      // In a real app, this would POST to /admin/settings
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2">
        <Settings className="w-8 h-8" />
        <h1 className="text-3xl font-bold">System Settings</h1>
      </div>

      <div className="p-6 bg-white rounded shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Settings */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">General</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="maintenanceMode"
                    checked={settings.maintenanceMode}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="font-medium">Maintenance Mode</span>
                </label>
                <p className="text-sm text-gray-600 ml-6">When enabled, only admins can access the system</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">API Timeout (seconds)</label>
                <input
                  type="number"
                  name="apiTimeout"
                  value={settings.apiTimeout}
                  onChange={handleChange}
                  min="5"
                  max="300"
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Session Timeout (seconds)</label>
                <input
                  type="number"
                  name="sessionTimeout"
                  value={settings.sessionTimeout}
                  onChange={handleChange}
                  min="300"
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Security</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Max Login Attempts</label>
                <input
                  type="number"
                  name="maxLoginAttempts"
                  value={settings.maxLoginAttempts}
                  onChange={handleChange}
                  min="1"
                  max="10"
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Minimum Password Length</label>
                <input
                  type="number"
                  name="minPasswordLength"
                  value={settings.minPasswordLength}
                  onChange={handleChange}
                  min="6"
                  max="20"
                  className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="twoFactorRequired"
                    checked={settings.twoFactorRequired}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="font-medium">Require Two-Factor Authentication</span>
                </label>
              </div>
            </div>
          </div>

          {/* Logging Settings */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Logging & Notifications</h2>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="auditLoggingEnabled"
                    checked={settings.auditLoggingEnabled}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="font-medium">Enable Audit Logging</span>
                </label>
                <p className="text-sm text-gray-600 ml-6">Log all user actions and system events</p>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="notificationsEnabled"
                    checked={settings.notificationsEnabled}
                    onChange={handleChange}
                    className="w-4 h-4 rounded"
                  />
                  <span className="font-medium">Enable Notifications</span>
                </label>
                <p className="text-sm text-gray-600 ml-6">Send notifications for important events</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {submitting ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>

      <div className="p-4 bg-blue-50 rounded border border-blue-200 text-sm text-blue-800">
        <p><strong>Note:</strong> System settings are currently stored locally. In production, persist these to a database.</p>
      </div>
    </div>
  )
}
