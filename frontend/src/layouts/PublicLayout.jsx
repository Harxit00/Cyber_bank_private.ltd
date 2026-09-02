import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/common/Navbar'

export default function PublicLayout(){
  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <main className="max-w-7xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
