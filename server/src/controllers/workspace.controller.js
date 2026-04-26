import Workspace from '../models/Workspace.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

export const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body
    const workspace = await Workspace.create({
      name,
      description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }]
    })
    return successResponse(res, 201, 'Workspace created', { workspace })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const getMyWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      'members.user': req.user._id
    }).populate('owner', 'name email')
    return successResponse(res, 200, 'Workspaces fetched', { workspaces })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
    if (!workspace) return errorResponse(res, 404, 'Workspace not found')
    return successResponse(res, 200, 'Workspace fetched', { workspace })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const updateWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body
    const workspace = await Workspace.findByIdAndUpdate(
      req.params.workspaceId,
      { name, description },
      { new: true, runValidators: true }
    )
    return successResponse(res, 200, 'Workspace updated', { workspace })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const deleteWorkspace = async (req, res) => {
  try {
    await Workspace.findByIdAndDelete(req.params.workspaceId)
    return successResponse(res, 200, 'Workspace deleted')
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const addMember = async (req, res) => {
  try {
    const { userId, role } = req.body
    const workspace = await Workspace.findById(req.params.workspaceId)
    const alreadyMember = workspace.members.find(m => m.user.toString() === userId)
    if (alreadyMember) return errorResponse(res, 400, 'User is already a member')
    workspace.members.push({ user: userId, role: role || 'member' })
    await workspace.save()
    return successResponse(res, 200, 'Member added', { workspace })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const removeMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId)
    workspace.members = workspace.members.filter(
      m => m.user.toString() !== req.params.userId
    )
    await workspace.save()
    return successResponse(res, 200, 'Member removed', { workspace })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}
