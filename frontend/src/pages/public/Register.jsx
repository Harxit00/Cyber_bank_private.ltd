import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../../services/api'

export default function Register(){
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const submit = async (e) =>{
    e.preventDefault()
    try{
      await api.post('/auth/register', form)
      toast.success('Registered. Please login')
    }catch(e){
      toast.error(e?.response?.data?.message || 'Register failed')
    }
  }
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-8">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm">Name</label>
          <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input type="password" value={form.password} onChange={e=>setForm({...form, password: e.target.value})} className="w-full border p-2 rounded" />
        </div>
        <div>
          <button className="w-full bg-green-600 text-white py-2 rounded">Register</button>
        </div>
      </form>
    </div>
  )
}
