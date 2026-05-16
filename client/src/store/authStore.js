import { create } from 'zustand'
import { loginApi, registerApi, logoutApi, getMeApi } from '../api/auth.js'
const useAuthStore = create((set) => ({
  user: null, isAuthenticated: false, isLoading: false,
  login: async (credentials) => { set({ isLoading: true }); const res = await loginApi(credentials); const { accessToken, user } = res.data.data; localStorage.setItem('accessToken', accessToken); set({ user, isAuthenticated: true, isLoading: false }); return user },
  register: async (data) => {
  set({ isLoading: true })
  try {
    const res = await registerApi(data)
    set({ isLoading: false })
    return res.data.message  // just return the message, no token yet
  } catch (err) {
    set({ isLoading: false })
    throw err
  }
},
  logout: async () => { await logoutApi(); localStorage.removeItem('accessToken'); set({ user: null, isAuthenticated: false }) },
  fetchMe: async () => { try { const res = await getMeApi(); set({ user: res.data.data.user, isAuthenticated: true }) } catch { localStorage.removeItem('accessToken'); set({ user: null, isAuthenticated: false }) } }
}))
export default useAuthStore