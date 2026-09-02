import React, { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import ProtectedRoute from '../components/common/ProtectedRoute'
import Unauthorized from '../pages/public/Unauthorized'

// lazy pages
const Home = lazy(() => import('../pages/public/Home'))
const Login = lazy(() => import('../pages/public/Login'))
const Register = lazy(() => import('../pages/public/Register'))

const CustomerDashboard = lazy(() => import('../pages/customer/Dashboard'))
const EmployeeDashboard = lazy(() => import('../pages/employee/Dashboard'))
const ManagerDashboard = lazy(() => import('../pages/manager/Dashboard'))
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'))

export default function AppRoutes(){
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<div className="p-8">About</div>} />
          <Route path="/services" element={<div className="p-8">Services</div>} />
          <Route path="/contact" element={<div className="p-8">Contact</div>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['customer']}/> }>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['employee']} /> }>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['manager']} /> }>
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['admin']} /> }>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

      </Routes>
    </Suspense>
  )
}
