import React from 'react'

export default function Dashboard(){
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Customer Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded shadow">Total balance: <span className="font-semibold">$12,345.67</span></div>
        <div className="p-4 bg-white rounded shadow">Recent transactions</div>
        <div className="p-4 bg-white rounded shadow">Quick actions</div>
      </div>

      <div className="p-4 bg-white rounded shadow">Transactions chart placeholder (Recharts will be integrated)</div>
    </div>
  )
}
