import { verifyAccessToken } from '../utils/jwt.js'
import { errorResponse } from '../utils/apiResponse.js'
import User from '../models/User.js'

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'Not authorized, no token')
    }
    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token)
    const user = await User.findById(decoded.id)
    if (!user) return errorResponse(res, 401, 'User no longer exists')
    req.user = user
    next()
  } catch (error) {
    return errorResponse(res, 401, 'Not authorized, invalid token')
  }
}
