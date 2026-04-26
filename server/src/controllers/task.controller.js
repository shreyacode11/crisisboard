import Task from '../models/Task.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, type, assignee, dueDate, status, storyPoints } = req.body
    const task = await Task.create({
      title, description, priority, type, assignee, dueDate, status, storyPoints,
      project: req.params.projectId,
      board: req.body.boardId,
      sprint: req.body.sprintId || null,
      reporter: req.user._id
    })
    const populated = await task.populate([
      { path: 'assignee', select: 'name email avatar' },
      { path: 'reporter', select: 'name email avatar' }
    ])
    return successResponse(res, 201, 'Task created', { task: populated })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const getTasks = async (req, res) => {
  try {
    const filter = { project: req.params.projectId }
    if (req.query.boardId) filter.board = req.query.boardId
    if (req.query.sprintId) filter.sprint = req.query.sprintId
    if (req.query.assignee) filter.assignee = req.query.assignee
    if (req.query.priority) filter.priority = req.query.priority
    if (req.query.status) filter.status = req.query.status

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .sort({ order: 1, createdAt: -1 })
    return successResponse(res, 200, 'Tasks fetched', { tasks })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .populate('comments.author', 'name email avatar')
    if (!task) return errorResponse(res, 404, 'Task not found')
    return successResponse(res, 200, 'Task fetched', { task })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true, runValidators: true })
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
    if (!task) return errorResponse(res, 404, 'Task not found')
    return successResponse(res, 200, 'Task updated', { task })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.taskId)
    return successResponse(res, 200, 'Task deleted')
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
    if (!task) return errorResponse(res, 404, 'Task not found')
    task.comments.push({ author: req.user._id, content: req.body.content })
    await task.save()
    await task.populate('comments.author', 'name email avatar')
    return successResponse(res, 201, 'Comment added', { comments: task.comments })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const updateTaskOrder = async (req, res) => {
  try {
    const { tasks } = req.body
    const bulkOps = tasks.map(({ id, order, status }) => ({
      updateOne: {
        filter: { _id: id },
        update: { order, status }
      }
    }))
    await Task.bulkWrite(bulkOps)
    return successResponse(res, 200, 'Task order updated')
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}
