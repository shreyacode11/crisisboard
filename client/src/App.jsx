// import { useEffect } from 'react'
// import { Routes, Route, Navigate } from 'react-router-dom'
// import useAuthStore from './store/authStore.js'
// import LoginPage from './pages/LoginPage.jsx'
// import RegisterPage from './pages/RegisterPage.jsx'
// import DashboardPage from './pages/DashboardPage.jsx'
// import BoardPage from './pages/BoardPage.jsx'
// import ProtectedRoute from './components/ProtectedRoute.jsx'
// export default function App() {
//   const { fetchMe } = useAuthStore()
//   useEffect(() => { fetchMe() }, [])
//   return (<Routes>
//     <Route path='/login' element={<LoginPage />} />
//     <Route path='/register' element={<RegisterPage />} />
//     <Route path='/' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
//     <Route path='/board/:workspaceId/:projectId/:boardId' element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
//     <Route path='*' element={<Navigate to='/' />} />
//   </Routes>)
// }
import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import useAuthStore from './store/authStore.js'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import BoardPage from './pages/BoardPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import VerifyEmailPage from './pages/VerifyEmailPage.jsx'
export default function App() {
  const { fetchMe } = useAuthStore()
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    const token = localStorage.getItem('accessToken')
    if (token) fetchMe()
  }, [])

  return (
    <Routes>
      
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/verify-email' element={<div>Verifying...</div>} />
      <Route path='/' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path='/board/:workspaceId/:projectId/:boardId' element={<ProtectedRoute><BoardPage /></ProtectedRoute>} />
      <Route path='*' element={<Navigate to='/' />} />
    </Routes>
  )
}