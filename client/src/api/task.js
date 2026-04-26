import api from './axios.js'
export const createTaskApi = (wId, pId, data) => api.post(`/workspaces/${wId}/projects/${pId}/tasks`, data)
export const getTasksApi = (wId, pId, params) => api.get(`/workspaces/${wId}/projects/${pId}/tasks`, { params })
export const getTaskApi = (wId, pId, tId) => api.get(`/workspaces/${wId}/projects/${pId}/tasks/${tId}`)
export const updateTaskApi = (wId, pId, tId, data) => api.put(`/workspaces/${wId}/projects/${pId}/tasks/${tId}`, data)
export const deleteTaskApi = (wId, pId, tId) => api.delete(`/workspaces/${wId}/projects/${pId}/tasks/${tId}`)
export const addCommentApi = (wId, pId, tId, data) => api.post(`/workspaces/${wId}/projects/${pId}/tasks/${tId}/comments`, data)
export const reorderTasksApi = (wId, pId, data) => api.put(`/workspaces/${wId}/projects/${pId}/tasks/reorder`, data)