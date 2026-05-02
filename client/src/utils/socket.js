import { io } from 'socket.io-client'


const BASE = 'https://crisisboard-api.onrender.com'

let socket

export const connectSocket = () => {
  if (!socket) {
    socket = io(BASE, { withCredentials: true })
  }
  return socket
}

export const getSocket = () => socket

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null }
}