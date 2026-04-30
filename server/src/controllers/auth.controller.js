import User from '../models/User.js'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) return errorResponse(res, 400, 'Email already registered')
    const user = await User.create({ name, email, password })
    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)
    user.refreshToken = refreshToken
    await user.save()
    res.cookie('refreshToken', refreshToken, cookieOptions)
    return successResponse(res, 201, 'Registration successful', {
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    console.error('REGISTER ERROR:', error.message)
    return errorResponse(res, 500, error.message)
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email }).select('+password +refreshToken')
    if (!user || !(await user.comparePassword(password))) {
      return errorResponse(res, 401, 'Invalid email or password')
    }
    const accessToken = generateAccessToken(user._id)
    const refreshToken = generateRefreshToken(user._id)
    user.refreshToken = refreshToken
    await user.save()
    res.cookie('refreshToken', refreshToken, cookieOptions)
    return successResponse(res, 200, 'Login successful', {
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken
    if (!token) return errorResponse(res, 401, 'No refresh token')
    const decoded = verifyRefreshToken(token)
    const user = await User.findById(decoded.id).select('+refreshToken')
    if (!user || user.refreshToken !== token) {
      return errorResponse(res, 401, 'Invalid refresh token')
    }
    const newAccessToken = generateAccessToken(user._id)
    const newRefreshToken = generateRefreshToken(user._id)
    user.refreshToken = newRefreshToken
    await user.save()
    res.cookie('refreshToken', newRefreshToken, cookieOptions)
    return successResponse(res, 200, 'Token refreshed', { accessToken: newAccessToken })
  } catch (error) {
    return errorResponse(res, 401, 'Invalid or expired refresh token')
  }
}

export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken
    if (token) {
      const user = await User.findOne({ refreshToken: token }).select('+refreshToken')
      if (user) { user.refreshToken = null; await user.save() }
    }
    res.clearCookie('refreshToken')
    return successResponse(res, 200, 'Logged out successfully')
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    return successResponse(res, 200, 'User fetched', { user })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}
