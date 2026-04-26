import api from './axios.js'
export const createWorkspaceApi = (data) => api.post('/workspaces', data)
export const getWorkspacesApi = () => api.get('/workspaces')
export const getWorkspaceApi = (id) => api.get(`/workspaces/${id}`)
export const updateWorkspaceApi = (id, data) => api.put(`/workspaces/${id}`, data)
export const addMemberApi = (id, data) => api.post(`/workspaces/${id}/members`, data)