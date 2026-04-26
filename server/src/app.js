import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import workspaceRoutes from './routes/workspace.routes.js'
import projectRoutes from './routes/project.routes.js'
import boardRoutes from './routes/board.routes.js'
import taskRoutes from './routes/task.routes.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/workspaces', workspaceRoutes)
app.use('/api/workspaces/:workspaceId/projects', projectRoutes)
app.use('/api/workspaces/:workspaceId/projects/:projectId/boards', boardRoutes)
app.use('/api/workspaces/:workspaceId/projects/:projectId/tasks', taskRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

export default app
