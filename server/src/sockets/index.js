import { Server } from 'socket.io'
import User from '../models/User.js'

let io

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: function (origin, cb) {
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

  io.on('connection', async (socket) => {
    console.log('Socket connected:', socket.id)
    const userId = socket.handshake.auth.userId

    if (userId) {
      await User.findByIdAndUpdate(userId, { isOnline: true })
      socket.broadcast.emit('user_online', { userId })
    }

    socket.on('join_board', (boardId) => { socket.join(boardId); console.log(`Socket ${socket.id} joined board ${boardId}`) })
    socket.on('leave_board', (boardId) => socket.leave(boardId))
    socket.on('join_workspace', (workspaceId) => socket.join(`workspace_${workspaceId}`))
    socket.on('leave_workspace', (workspaceId) => socket.leave(`workspace_${workspaceId}`))
    socket.on('task_updated', (data) => socket.to(data.boardId).emit('task_updated', data))
    socket.on('task_created', (data) => socket.to(data.boardId).emit('task_created', data))
    socket.on('task_deleted', (data) => socket.to(data.boardId).emit('task_deleted', data))

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
