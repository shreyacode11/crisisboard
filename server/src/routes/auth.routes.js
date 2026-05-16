import express from 'express'
import { register, login, logout, refreshAccessToken, getMe, verifyEmail } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh', refreshAccessToken)
router.get('/me', protect, getMe)
router.get('/verify-email', verifyEmail)   // ← use the controller, not inline

export default router