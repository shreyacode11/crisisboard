import express from 'express'
import { register, login, logout, refreshAccessToken, getMe } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh', refreshAccessToken)
router.get('/me', protect, getMe)
router.get('/verify-email', async (req, res) => {
  const { token } = req.query
  const user = await User.findOne({ verifyToken: token, verifyTokenExpiry: { $gt: Date.now() } })
  if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired link' })
  user.isVerified = true
  user.verifyToken = undefined
  user.verifyTokenExpiry = undefined
  await user.save()
  res.json({ success: true, message: 'Email verified! You can now log in.' })
})

export default router
