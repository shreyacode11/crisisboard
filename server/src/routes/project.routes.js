import express from 'express'
import { createProject, getProjects, getProject, updateProject, deleteProject } from '../controllers/project.controller.js'
import { protect } from '../middleware/auth.js'
import { requireWorkspaceRole } from '../middleware/rbac.js'

const router = express.Router({ mergeParams: true })

router.use(protect)
router.use(requireWorkspaceRole('admin', 'member', 'viewer'))

router.post('/', createProject)
router.get('/', getProjects)
router.get('/:projectId', getProject)
router.put('/:projectId', updateProject)
router.delete('/:projectId', deleteProject)

export default router
