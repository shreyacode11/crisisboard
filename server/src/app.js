import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.routes.js'
import workspaceRoutes from './routes/workspace.routes.js'
import projectRoutes from './routes/project.routes.js'
import boardRoutes from './routes/board.routes.js'
import taskRoutes from './routes/task.routes.js'

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL
].filter(Boolean)

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' })
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: 'Too many auth attempts' })

app.use(helmet())
app.use(cors({
  origin: function(origin, cb) {
    if (!origin) return cb(null, true)
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app')
    ) {
      return cb(null, true)
    }
    return cb(new Error('Not allowed by CORS'))
  },
  credentials: true
}))

app.options('/{*path}', cors({
  origin: function(origin, cb) {
    if (!origin) return cb(null, true)
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return cb(null, true)
    }
    return cb(new Error('Not allowed by CORS'))
  },
  credentials: true
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use('/api', limiter)
app.use('/api/auth', authLimiter)

app.get('/health', (req, res) => res.json({ status: 'ok', env: process.env.NODE_ENV }))

app.use('/api/auth', authRoutes)
app.use('/api/workspaces', workspaceRoutes)
app.use('/api/workspaces/:workspaceId/projects', projectRoutes)
app.use('/api/workspaces/:workspaceId/projects/:projectId/boards', boardRoutes)
app.use('/api/workspaces/:workspaceId/projects/:projectId/tasks', taskRoutes)
app.use((err, req, res, next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ success: false, message: 'CORS not allowed' })
  }
  console.error(err.stack)
  res.status(500).json({ success: false, message: 'Internal server error' })
})


app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }))

export default app