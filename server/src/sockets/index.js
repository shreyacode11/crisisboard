import { Server } from 'socket.io'
import User from '../models/User.js'  // ← add this import

let io

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: function(origin, cb) {
        if (!origin) return cb(null, true)
        if (
          ['http://localhost:5173', 'http://localhost:3000'].includes(origin) ||
          origin.endsWith('.vercel.app')
        ) return cb(null, true)
        return cb(new Error('Not allowed'))
      },
      credentials: true
    }
  })

  // ✅ Single connection block, async, everything merged
  io.on('connection', async (socket) => {
    console.log('Socket connected:', socket.id)

    const userId = socket.handshake.auth.userId

    // Mark user online
    if (userId) {
      await User.findByIdAndUpdate(userId, { isOnline: true })
      socket.broadcast.emit('user_online', { userId })  // tell others, not yourself
    }

    // Board room events
    socket.on('join_board', (boardId) => {
      socket.join(boardId)
      console.log(`Socket ${socket.id} joined board ${boardId}`)
    })

    socket.on('leave_board', (boardId) => {
      socket.leave(boardId)
    })

    socket.on('task_updated', (data) => {
      socket.to(data.boardId).emit('task_updated', data)
    })

    socket.on('task_created', (data) => {
      socket.to(data.boardId).emit('task_created', data)
    })

    socket.on('task_deleted', (data) => {
      socket.to(data.boardId).emit('task_deleted', data)
    })

    // Disconnect — mark offline
    socket.on('disconnect', async () => {
      console.log('Socket disconnected:', socket.id)
      if (userId) {
        await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() })
        socket.broadcast.emit('user_offline', { userId })
      }
    })
  })

  return io
}

export const getIO = () => io