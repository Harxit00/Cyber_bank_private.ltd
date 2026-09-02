// roleRoutes.js: central list of available routes per role (used by sidebar/layouts)
export const roleRoutes = {
  customer: [
    { path: '/customer/dashboard', label: 'Dashboard' },
    { path: '/customer/accounts', label: 'Accounts' },
    { path: '/customer/make-payment', label: 'Make Payment' },
    { path: '/customer/transactions', label: 'Transactions' },
    { path: '/customer/beneficiaries', label: 'Beneficiaries' },
    { path: '/customer/support', label: 'Support' }
  ],
  employee: [
    { path: '/employee/dashboard', label: 'Dashboard' },
    { path: '/employee/customer-lookup', label: 'Customer Lookup' }
  ],
  manager: [
    { path: '/manager/dashboard', label: 'Dashboard' },
    { path: '/manager/team', label: 'Team Overview' }
  ],
  admin: [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/users', label: 'User Management' }
  ]
}
