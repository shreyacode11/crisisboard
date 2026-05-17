import { io } from 'socket.io-client'
import useAuthStore from '../store/authStore.js'

const BASE = 'https://crisisboard-api.onrender.com'

let socket

export const connectSocket = () => {
  if (!socket) {
    const { user } = useAuthStore.getState()
    socket = io(BASE, {
      withCredentials: true,
      auth: { userId: user?._id }
    })
  }
  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null }
}
