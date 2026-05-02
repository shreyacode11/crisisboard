import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react'
import useAuthStore from '../store/authStore.js'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true)
    try { await register(form); toast.success('Welcome to CrisisBoard!'); navigate('/') }
    catch (err) { toast.error(err.response?.data?.message || 'Registration failed') }
    finally { setLoading(false) }
  }

  return (
    <div className='min-h-screen relative overflow-hidden flex items-center justify-center p-4'>
      <div className='absolute inset-0 grid-bg opacity-40' />
      <div className='absolute top-20 -right-20 w-96 h-96 bg-pink-600/30 rounded-full blur-3xl animate-float' />
      <div className='absolute bottom-20 -left-20 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl animate-float' style={{animationDelay:'2s'}} />

      <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:0.6}}
        className='relative w-full max-w-md'>

        <div className='glass-strong rounded-3xl p-8 shadow-2xl'>
          <motion.div initial={{scale:0}} animate={{scale:1}} transition={{delay:0.2, type:'spring'}}
            className='flex justify-center mb-6'>
            <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center animate-pulse-glow'>
              <Sparkles className='w-8 h-8 text-white' />
            </div>
          </motion.div>

          <div className='text-center mb-8'>
            <h1 className='text-4xl font-bold mb-2'><span className='gradient-text'>Get Started</span></h1>
            <p className='text-zinc-400 text-sm'>Create your account in seconds</p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay:0.25}}>
              <label className='block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider'>Full Name</label>
              <div className='relative group'>
                <User className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors' />
                <input type='text' required value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  className='w-full bg-white/5 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/20 transition-all text-sm'
                  placeholder='Your name' />
              </div>
            </motion.div>

            <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay:0.35}}>
              <label className='block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider'>Email</label>
              <div className='relative group'>
                <Mail className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors' />
                <input type='email' required value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className='w-full bg-white/5 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/20 transition-all text-sm'
                  placeholder='you@example.com' />
              </div>
            </motion.div>

            <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay:0.45}}>
              <label className='block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider'>Password</label>
              <div className='relative group'>
                <Lock className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 transition-colors' />
                <input type='password' required value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className='w-full bg-white/5 border border-white/10 text-white rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-indigo-500 focus:bg-white/10 focus:ring-4 focus:ring-indigo-500/20 transition-all text-sm'
                  placeholder='Minimum 6 characters' />
              </div>
            </motion.div>

            <motion.button initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.55}}
              whileHover={{scale:1.02}} whileTap={{scale:0.98}}
              type='submit' disabled={loading}
              className='w-full relative group bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-semibold rounded-xl px-4 py-3.5 transition-all disabled:opacity-50 overflow-hidden'>
              <span className='relative flex items-center justify-center gap-2'>
                {loading ? 'Creating account...' : <>Create Account <ArrowRight size={16} className='group-hover:translate-x-1 transition-transform' /></>}
              </span>
             </motion.button>
          </form>

          <div className='mt-6 text-center'>
            <p className='text-zinc-500 text-sm'>
              Already have an account? <Link to='/login' className='text-indigo-400 hover:text-indigo-300 font-medium transition-colors'>Sign in</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}