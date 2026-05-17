import express from 'express'
import {
  createWorkspace, getMyWorkspaces, getWorkspace, getWorkspaceMembers,
  updateWorkspace, deleteWorkspace, addMember, removeMember,
  requestToJoin, respondToRequest
} from '../controllers/workspace.controller.js'
import { protect } from '../middleware/auth.js'
import { requireWorkspaceRole } from '../middleware/rbac.js'
import Project from '../models/Project.js'

const router = express.Router()

router.use(protect)

router.post('/', createWorkspace)
router.get('/', getMyWorkspaces)

router.post('/:workspaceId/request', requestToJoin)
router.post('/:workspaceId/request/:userId/respond', requireWorkspaceRole('admin'), respondToRequest)

router.get('/:workspaceId/members', requireWorkspaceRole('admin', 'member', 'viewer'), getWorkspaceMembers)
router.post('/:workspaceId/members', requireWorkspaceRole('admin'), addMember)
router.delete('/:workspaceId/members/:userId', requireWorkspaceRole('admin'), removeMember)

router.get('/:workspaceId', requireWorkspaceRole('admin', 'member', 'viewer'), getWorkspace)
router.put('/:workspaceId', requireWorkspaceRole('admin'), updateWorkspace)
router.delete('/:workspaceId', requireWorkspaceRole('admin'), deleteWorkspace)

router.delete('/:workspaceId/projects/:projectId', async (req, res) => {
  await Project.findByIdAndDelete(req.params.projectId)
  res.json({ success: true })
})

export default router
