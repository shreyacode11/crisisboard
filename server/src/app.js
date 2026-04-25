import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.post('/test-register', async (req, res) => {
  try {
    console.log('Body:', req.body)
    const User = (await import('./models/User.js')).default
    const user = await User.create(req.body)
    console.log('Created:', user._id)
    res.json({ success: true, id: user._id })
  } catch (err) {
    console.error('RAW ERROR:', err.message)
    res.json({ success: false, error: err.message })
  }
})

app.use('/api/auth', authRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

export default app
