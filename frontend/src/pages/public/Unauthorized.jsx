import React from 'react'

export default function Unauthorized(){
  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-semibold">Unauthorized</h2>
      <p className="mt-2 text-gray-600">You do not have permission to view this page.</p>
    </div>
  )
}
