// import axios from 'axios'
// const api = axios.create({ baseURL: '/api', withCredentials: true })
// api.interceptors.request.use((config) => { const token = localStorage.getItem('accessToken'); if (token) config.headers.Authorization = `Bearer ${token}`; return config })
// api.interceptors.response.use((response) => response, async (error) => { const original = error.config; if (error.response?.status === 401 && !original._retry) { original._retry = true; try { const res = await axios.post('/api/auth/refresh', {}, { withCredentials: true }); const newToken = res.data.data.accessToken; localStorage.setItem('accessToken', newToken); original.headers.Authorization = `Bearer ${newToken}`; return api(original) } catch { localStorage.removeItem('accessToken'); window.location.href = '/login' } } return Promise.reject(error) })
// export default api
import { API_URL } from '../config'
import axios from 'axios'

const api = axios.create({ 
  baseURL: `${API_URL}/api`, 
  withCredentials: true 
})

api.interceptors.request.use((config) => { 
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config 
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (original._retry || original.url?.includes('/auth/refresh') || original.url?.includes('/auth/me')) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
      return Promise.reject(error)
    }
    if (error.response?.status === 401) {
      original._retry = true
      try {
        const res = await axios.post(`${API_URL}/api/auth/refresh`, {}, { withCredentials: true })
        const newToken = res.data.data.accessToken
        localStorage.setItem('accessToken', newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api