// import { Navigate } from 'react-router-dom'
// import useAuthStore from '../store/authStore.js'
// export default function ProtectedRoute({ children }) {
//   const { isAuthenticated } = useAuthStore()
//   const token = localStorage.getItem('accessToken')
//   if (!isAuthenticated && !token) return <Navigate to='/login' />
//   return children
// }

import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/authStore.js'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStore()
  const token = localStorage.getItem('accessToken')
  if (!token) return <Navigate to='/login' replace />
  if (!isAuthenticated) return null
  return children
}