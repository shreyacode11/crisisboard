import express from 'express'
import { createBoard, getBoards, getBoard, updateBoard, deleteBoard } from '../controllers/board.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router({ mergeParams: true })

router.use(protect)

router.post('/', createBoard)
router.get('/', getBoards)
router.get('/:boardId', getBoard)
router.put('/:boardId', updateBoard)
router.delete('/:boardId', deleteBoard)

export default router
