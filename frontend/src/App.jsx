import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'

export default function App(){
  return (
    <Routes>
      <Route path="/*" element={<AppRoutes />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
    </Routes>
  )
}
