// roleRoutes.js: central list of available routes per role (used by sidebar/layouts)
export const roleRoutes = {
  customer: [
    { path: '/customer/dashboard', label: 'Dashboard' },
    { path: '/customer/accounts', label: 'Accounts' },
    { path: '/customer/make-payment', label: 'Make Payment' },
    { path: '/customer/transactions', label: 'Transactions' },
    { path: '/customer/beneficiaries', label: 'Beneficiaries' },
    { path: '/customer/support', label: 'Support' },
    { path: '/customer/profile', label: 'Profile' }
  ],
  employee: [
    { path: '/employee/dashboard', label: 'Dashboard' },
    { path: '/employee/customer-lookup', label: 'Customer Lookup' },
    { path: '/employee/transaction-lookup', label: 'Transaction Lookup' },
    { path: '/employee/support', label: 'Support Tickets' }
  ],
  manager: [
    { path: '/manager/dashboard', label: 'Dashboard' },
    { path: '/manager/team', label: 'Team Overview' },
    { path: '/manager/transactions', label: 'All Transactions' },
    { path: '/manager/reports', label: 'Reports' },
    { path: '/manager/requests', label: 'Approve Requests' }
  ],
  admin: [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/users', label: 'User Management' },
    { path: '/admin/audit-logs', label: 'Audit Logs' },
    { path: '/admin/settings', label: 'System Settings' },
    { path: '/admin/roles', label: 'Role Management' },
    { path: '/admin/reports', label: 'Admin Reports' }
  ]
}
