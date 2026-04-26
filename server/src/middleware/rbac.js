import Workspace from '../models/Workspace.js'
import { errorResponse } from '../utils/apiResponse.js'

export const requireWorkspaceRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const workspace = await Workspace.findById(req.params.workspaceId)
      if (!workspace) return errorResponse(res, 404, 'Workspace not found')

      const member = workspace.members.find(
        m => m.user.toString() === req.user._id.toString()
      )
      const isOwner = workspace.owner.toString() === req.user._id.toString()

      if (!isOwner && (!member || !roles.includes(member.role))) {
        return errorResponse(res, 403, 'You do not have permission to perform this action')
      }

      req.workspace = workspace
      req.userRole = isOwner ? 'admin' : member.role
      next()
    } catch (error) {
      return errorResponse(res, 500, error.message)
    }
  }
}
