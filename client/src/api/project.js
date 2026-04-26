import api from './axios.js'
export const createProjectApi = (wId, data) => api.post(`/workspaces/${wId}/projects`, data)
export const getProjectsApi = (wId) => api.get(`/workspaces/${wId}/projects`)
export const getProjectApi = (wId, pId) => api.get(`/workspaces/${wId}/projects/${pId}`)
export const updateProjectApi = (wId, pId, data) => api.put(`/workspaces/${wId}/projects/${pId}`, data)
export const deleteProjectApi = (wId, pId) => api.delete(`/workspaces/${wId}/projects/${pId}`)