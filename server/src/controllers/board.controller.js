import Board from '../models/Board.js'
import { successResponse, errorResponse } from '../utils/apiResponse.js'

export const createBoard = async (req, res) => {
  try {
    const { name } = req.body
    const board = await Board.create({
      name,
      project: req.params.projectId,
      createdBy: req.user._id
    })
    return successResponse(res, 201, 'Board created', { board })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ project: req.params.projectId })
      .populate('createdBy', 'name email')
    return successResponse(res, 200, 'Boards fetched', { boards })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId)
    if (!board) return errorResponse(res, 404, 'Board not found')
    return successResponse(res, 200, 'Board fetched', { board })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const updateBoard = async (req, res) => {
  try {
    const board = await Board.findByIdAndUpdate(req.params.boardId, req.body, { new: true })
    return successResponse(res, 200, 'Board updated', { board })
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}

export const deleteBoard = async (req, res) => {
  try {
    await Board.findByIdAndDelete(req.params.boardId)
    return successResponse(res, 200, 'Board deleted')
  } catch (error) {
    return errorResponse(res, 500, error.message)
  }
}
