import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import useAuthStore from '../store/authStore.js'
export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); try { await register(form); toast.success('Account created!'); navigate('/') } catch (err) { toast.error(err.response?.data?.message || 'Registration failed') } finally { setLoading(false) } }
  return (<div className='min-h-screen bg-gray-950 flex items-center justify-center p-4'>
    <div className='bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md'>
      <div className='mb-8 text-center'><h1 className='text-3xl font-bold text-white mb-2'>CrisisBoard</h1><p className='text-gray-400'>Create your account</p></div>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div><label className='block text-sm font-medium text-gray-300 mb-1'>Name</label>
          <input type='text' required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className='w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500' placeholder='Your name' /></div>
        <div><label className='block text-sm font-medium text-gray-300 mb-1'>Email</label>
          <input type='email' required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className='w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500' placeholder='you@example.com' /></div>
        <div><label className='block text-sm font-medium text-gray-300 mb-1'>Password</label>
          <input type='password' required value={form.password} onChange={e => setForm({...form, password: e.target.value})} className='w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500' placeholder='Min 6 characters' /></div>
        <button type='submit' disabled={loading} className='w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg px-4 py-3 transition-colors'>{loading ? 'Creating account...' : 'Create Account'}</button>
      </form>
      <p className='text-center text-gray-400 mt-6'>Have an account? <Link to='/login' className='text-blue-400 hover:underline'>Sign in</Link></p>
    </div></div>)
}