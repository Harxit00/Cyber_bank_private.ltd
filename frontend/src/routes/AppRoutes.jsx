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

// newly added pages
const Beneficiaries = lazy(() => import('../pages/customer/Beneficiaries'))
const MakePayment = lazy(() => import('../pages/customer/MakePayment'))
const SupportTickets = lazy(() => import('../pages/customer/Support'))

const CustomerLookup = lazy(() => import('../pages/employee/CustomerLookup'))
const TransactionLookup = lazy(() => import('../pages/employee/TransactionLookup'))
const EmployeeSupport = lazy(() => import('../pages/employee/Support'))

const TeamOverview = lazy(() => import('../pages/manager/TeamOverview'))
const ManagerReports = lazy(() => import('../pages/manager/Reports'))
const AllTransactions = lazy(() => import('../pages/manager/Transactions'))
const ApproveRequests = lazy(() => import('../pages/manager/Requests'))

const UserManagement = lazy(() => import('../pages/admin/UserManagement'))
const AuditLogs = lazy(() => import('../pages/admin/AuditLogs'))
const SystemSettings = lazy(() => import('../pages/admin/SystemSettings'))
const RoleManagement = lazy(() => import('../pages/admin/RoleManagement'))
const AdminReports = lazy(() => import('../pages/admin/AdminReports'))

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

        <Route element={<ProtectedRoute allowedRoles={[ 'customer' ]}/> }>
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/accounts" element={<div className="p-8">Accounts</div>} />
          <Route path="/customer/make-payment" element={<MakePayment />} />
          <Route path="/customer/transactions" element={<div className="p-8">Transactions</div>} />
          <Route path="/customer/beneficiaries" element={<Beneficiaries />} />
          <Route path="/customer/support" element={<SupportTickets />} />
          <Route path="/customer/profile" element={<div className="p-8">Profile</div>} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ 'employee' ]} /> }>
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/customer-lookup" element={<CustomerLookup />} />
          <Route path="/employee/transaction-lookup" element={<TransactionLookup />} />
          <Route path="/employee/support" element={<EmployeeSupport />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ 'manager' ]} /> }>
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/team" element={<TeamOverview />} />
          <Route path="/manager/transactions" element={<AllTransactions />} />
          <Route path="/manager/reports" element={<ManagerReports />} />
          <Route path="/manager/requests" element={<ApproveRequests />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={[ 'admin' ]} /> }>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/audit-logs" element={<AuditLogs />} />
          <Route path="/admin/settings" element={<SystemSettings />} />
          <Route path="/admin/roles" element={<RoleManagement />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>

      </Routes>
    </Suspense>
  )
}
