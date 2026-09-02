import React from 'react'

export default function Home(){
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-blue-700">Welcome to CyberBank Pvt. Ltd.</h1>
      <p className="mt-4 text-gray-600 max-w-2xl mx-auto">A dummy virtual banking web app for security testing labs. Try login as different roles to explore dashboards.</p>

      <div className="mt-8 flex justify-center gap-4">
        <div className="p-6 bg-white rounded shadow-md">
          <h3 className="font-semibold">Services</h3>
          <p className="text-sm text-gray-500">Accounts, Payments, Support, KYC</p>
        </div>
        <div className="p-6 bg-white rounded shadow-md">
          <h3 className="font-semibold">Security Lab</h3>
          <p className="text-sm text-gray-500">Contains intentional frontend vulnerabilities for testing.</p>
        </div>
      </div>
    </div>
  )
}
