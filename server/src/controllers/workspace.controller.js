import Workspace from '../models/Workspace.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'
import { getIO } from '../sockets/index.js'

export const createWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body
    const workspace = await Workspace.create({
      name, description,
      owner: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }]
    })
    return successResponse(res, 201, 'Workspace created', { workspace })
  } catch (error) { return errorResponse(res, 500, error.message) }
}

export const getMyWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ 'members.user': req.user._id })
      .populate('owner', 'name email')
    return successResponse(res, 200, 'Workspaces fetched', { workspaces })
  } catch (error) { return errorResponse(res, 500, error.message) }
}

export const getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar isOnline lastSeen')
      .populate('joinRequests', 'name email avatar')
    if (!workspace) return errorResponse(res, 404, 'Workspace not found')
    return successResponse(res, 200, 'Workspace fetched', { workspace })
  } catch (error) { return errorResponse(res, 500, error.message) }
}

export const getWorkspaceMembers = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId)
      .populate('members.user', 'name email avatar isOnline lastSeen')
      .populate('joinRequests', 'name email avatar')
    if (!workspace) return errorResponse(res, 404, 'Workspace not found')
    return successResponse(res, 200, 'Members fetched', {
      members: workspace.members,
      joinRequests: workspace.joinRequests
    })
  } catch (error) { return errorResponse(res, 500, error.message) }
}

export const updateWorkspace = async (req, res) => {
  try {
    const { name, description } = req.body
    const workspace = await Workspace.findByIdAndUpdate(
      req.params.workspaceId, { name, description }, { new: true, runValidators: true }
    )
    return successResponse(res, 200, 'Workspace updated', { workspace })
  } catch (error) { return errorResponse(res, 500, error.message) }
}

export const deleteWorkspace = async (req, res) => {
  try {
    await Workspace.findByIdAndDelete(req.params.workspaceId)
    return successResponse(res, 200, 'Workspace deleted')
  } catch (error) { return errorResponse(res, 500, error.message) }
}

export const requestToJoin = async (req, res) => {
  try {
    const ws = await Workspace.findById(req.params.workspaceId)
      .populate('joinRequests', 'name email avatar')
    if (!ws) return errorResponse(res, 404, 'Workspace not found')
    const alreadyMember = ws.members.some(m => m.user.toString() === req.user._id.toString())
    const alreadyRequested = ws.joinRequests.some(r => r._id.toString() === req.user._id.toString())
    if (alreadyMember || alreadyRequested) return errorResponse(res, 400, 'Already a member or request pending')
    ws.joinRequests.push(req.user._id)
    await ws.save()
    try {
      getIO().to(`workspace_${ws._id}`).emit('join_request', {
        user: { _id: req.user._id, name: req.user.name, email: req.user.email }
      })
    } catch {}
    return successResponse(res, 200, 'Join request sent')
  } catch (error) { return errorResponse(res, 500, error.message) }
}

export const respondToRequest = async (req, res) => {
  try {
    const { action } = req.body
    const ws = await Workspace.findById(req.params.workspaceId)
    if (!ws) return errorResponse(res, 404, 'Workspace not found')
    ws.joinRequests = ws.joinRequests.filter(r => r.toString() !== req.params.userId)
    if (action === 'approve') ws.members.push({ user: req.params.userId, role: 'member' })
    await ws.save()
    try {
      getIO().to(`workspace_${ws._id}`).emit('request_responded', { userId: req.params.userId, action })
    } catch {}
    return successResponse(res, 200, `Request ${action}d`)
  } catch (error) { return errorResponse(res, 500, error.message) }
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
  } catch (error) { return errorResponse(res, 500, error.message) }
}

export const removeMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId)
    workspace.members = workspace.members.filter(m => m.user.toString() !== req.params.userId)
    await workspace.save()
    return successResponse(res, 200, 'Member removed')
  } catch (error) { return errorResponse(res, 500, error.message) }
}
