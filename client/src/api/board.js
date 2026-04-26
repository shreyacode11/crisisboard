import api from './axios.js'
export const createBoardApi = (wId, pId, data) => api.post(`/workspaces/${wId}/projects/${pId}/boards`, data)
export const getBoardsApi = (wId, pId) => api.get(`/workspaces/${wId}/projects/${pId}/boards`)
export const getBoardApi = (wId, pId, bId) => api.get(`/workspaces/${wId}/projects/${pId}/boards/${bId}`)