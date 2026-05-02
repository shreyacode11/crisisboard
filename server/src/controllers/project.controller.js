import Project from '../models/Project.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

export const createProject = async (req, res) => {
  try {
    const project = await Project.create({ name: req.body.name, description: req.body.description, workspace: req.params.workspaceId, createdBy: req.user._id })
    return successResponse(res, 201, 'Project created', { project })
  } catch (error) { return errorResponse(res, 500, error.message) }
}
export const deleteProject = async (req, res) => {
  try {
    await Task.deleteMany({ project: req.params.projectId })
    await Project.findByIdAndDelete(req.params.projectId)
    return successResponse(res, 200, 'Project deleted')
  } catch (err) {
    return errorResponse(res, 500, err.message)
  }
}

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ workspace: req.params.workspaceId }).populate('createdBy', 'name email')
    return successResponse(res, 200, 'Projects fetched', { projects })
  } catch (error) { return errorResponse(res, 500, error.message) }
}

export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId).populate('createdBy', 'name email avatar')
    if (!project) return errorResponse(res, 404, 'Project not found')
    return successResponse(res, 200, 'Project fetched', { project })
  } catch (error) { return errorResponse(res, 500, error.message) }
}

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.projectId, req.body, { new: true })
    return successResponse(res, 200, 'Project updated', { project })
  } catch (error) { return errorResponse(res, 500, error.message) }
}

