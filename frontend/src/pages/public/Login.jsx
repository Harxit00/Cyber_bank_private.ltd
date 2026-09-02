import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import auth from '../../services/auth.service'
import useAuth from '../../hooks/useAuth'
import toast from 'react-hot-toast'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const submit = async (e) =>{
    e.preventDefault()
    try{
      const res = await login({ email, password })
      toast.success('Logged in')
      // naive redirect based on role
      const token = res.token
      const role = auth.decodeTokenRole(token)
      if (role === 'customer') navigate('/customer/dashboard')
      else if (role === 'employee') navigate('/employee/dashboard')
      else if (role === 'manager') navigate('/manager/dashboard')
      else if (role === 'admin') navigate('/admin/dashboard')
      else navigate('/home')
    }catch(e){
      toast.error(e?.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-2 rounded" />
        </div>
        <div>
          <button className="w-full bg-blue-600 text-white py-2 rounded">Login</button>
        </div>
      </form>
    </div>
  )
}
