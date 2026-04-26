import express from 'express'
import { createWorkspace, getMyWorkspaces, getWorkspace, updateWorkspace, deleteWorkspace, addMember, removeMember } from '../controllers/workspace.controller.js'
import { protect } from '../middleware/auth.js'
import { requireWorkspaceRole } from '../middleware/rbac.js'

const router = express.Router()

router.use(protect)

router.post('/', createWorkspace)
router.get('/', getMyWorkspaces)
router.get('/:workspaceId', requireWorkspaceRole('admin', 'member', 'viewer'), getWorkspace)
router.put('/:workspaceId', requireWorkspaceRole('admin'), updateWorkspace)
router.delete('/:workspaceId', requireWorkspaceRole('admin'), deleteWorkspace)
router.post('/:workspaceId/members', requireWorkspaceRole('admin'), addMember)
router.delete('/:workspaceId/members/:userId', requireWorkspaceRole('admin'), removeMember)

export default router
