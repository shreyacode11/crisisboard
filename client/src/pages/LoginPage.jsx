import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Mail, Lock, ArrowRight, Sparkles } from 'lucide-react'
import useAuthStore from '../store/authStore.js'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()
const [searchParams] = useSearchParams() 

useEffect(() => {                                  // ← add this
    if (searchParams.get('verified') === 'true') {
      toast.success('Email verified! You can now sign in.')
    }
    if (searchParams.get('error') === 'invalid-link') {
      toast.error('Verification link is invalid or expired.')
    }
  }, [])
  
  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try { await login(form); toast.success('Welcome back!'); navigate('/') }
    catch (err) { toast.error(err.response?.data?.message || 'Login failed') }
    finally { setLoading(false) }
  }

  return (
    <div className='min-h-screen relative overflow-hidden flex items-center justify-center p-4'>
      <div className='absolute inset-0 grid-bg opacity-40' />
      <div className='absolute top-20 -left-20 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-float' />
      <div className='absolute bottom-20 -right-20 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-float' style={{animationDelay:'2s'}} />

      <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:0.6}}
        className='relative w-full max-w-md'>

        <div className='glass-strong rounded-3xl p-8 shadow-2xl'>
          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2, type:'spring'}}
            className='flex justify-center mb-6'>
            <div className='relative'>
              <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center animate-pulse-glow'>
                <Sparkles className='w-8 h-8 text-white' />
              </div>
            </div>
          </motion.div>

          <div className='text-center mb-8'>
            <h1 className='text-4xl font-bold mb-2'>
              <span className='gradient-text'>Priorit</span>
            </h1>
            <p className='text-zinc-400 text-sm'>Welcome back. Sign in to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-5'>
            <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay:0.3}}>
              <label className='block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider'>Email</label>
              <div className='relative group'>
                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors' />
                <input type='email' required value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className='w-full bg-white/5 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/20 transition-all text-sm'
                  placeholder='you@example.com' />
              </div>
            </motion.div>

            <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay:0.4}}>
              <label className='block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider'>Password</label>
              <div className='relative group'>
                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors' />
                <input type='password' required value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className='w-full bg-white/5 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/20 transition-all text-sm'
                  placeholder='Enter your password' />
              </div>
            </motion.div>

            <motion.button initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.5}}
              whileHover={{scale:1.02}} whileTap={{scale:0.98}}
              type='submit' disabled={loading}
              className='w-full relative group bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-xl px-4 py-3.5 transition-all disabled:opacity-50 overflow-hidden'>
              <div className='absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur-xl transition-opacity' />
              <span className='relative flex items-center justify-center gap-2'>
                {loading ? 'Signing in...' : <>Sign In <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform' /></>}
              </span>
            </motion.button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-zinc-500 text-sm'>
              New here? <Link to='/register' className='text-indigo-400 hover:text-indigo-300 font-medium transition-colors'>Create account</Link>
            </p>
          </div>
        </div>

        <p className='text-center text-zinc-600 text-xs mt-6'>Built with care · v1.0</p>
      </motion.div>
    </div>
  )
}