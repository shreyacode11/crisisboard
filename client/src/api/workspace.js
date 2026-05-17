import api from './axios.js'

export const createWorkspaceApi = (data) => api.post('/workspaces', data)
export const getWorkspacesApi = () => api.get('/workspaces')
export const getWorkspaceApi = (id) => api.get(`/workspaces/${id}`)
export const updateWorkspaceApi = (id, data) => api.put(`/workspaces/${id}`, data)
export const deleteWorkspaceApi = (id) => api.delete(`/workspaces/${id}`)
export const getWorkspaceMembersApi = (workspaceId) => api.get(`/workspaces/${workspaceId}/members`)
export const addMemberApi = (id, data) => api.post(`/workspaces/${id}/members`, data)
export const removeMemberApi = (workspaceId, userId) => api.delete(`/workspaces/${workspaceId}/members/${userId}`)
export const requestToJoinApi = (workspaceId) => api.post(`/workspaces/${workspaceId}/request`)
export const respondToRequestApi = (workspaceId, userId, action) =>
  api.post(`/workspaces/${workspaceId}/request/${userId}/respond`, { action })
