import express from 'express'
import { createTask, getTasks, getTask, updateTask, deleteTask, addComment, updateTaskOrder } from '../controllers/task.controller.js'
import { protect } from '../middleware/auth.js'

const router = express.Router({ mergeParams: true })

router.use(protect)

router.post('/', createTask)
router.get('/', getTasks)
router.put('/reorder', updateTaskOrder)
router.get('/:taskId', getTask)
router.put('/:taskId', updateTask)
router.delete('/:taskId', deleteTask)
router.post('/:taskId/comments', addComment)

export default router
