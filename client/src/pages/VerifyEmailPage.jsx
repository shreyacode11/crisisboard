import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const [msg, setMsg] = useState('Verifying...')
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/auth/verify-email?token=${params.get('token')}`)
      .then(() => { setMsg('Email verified! Redirecting to login...'); setTimeout(() => navigate('/login'), 2000) })
      .catch(err => setMsg(err.response?.data?.message || 'Verification failed'))
  }, [])

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='glass-strong rounded-2xl p-10 text-center max-w-sm'>
        <h2 className='text-2xl font-bold gradient-text mb-3'>Email Verification</h2>
        <p className='text-zinc-400'>{msg}</p>
      </div>
    </div>
  )
}