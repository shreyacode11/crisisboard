// import { create } from 'zustand'
// import { getWorkspacesApi, createWorkspaceApi } from '../api/workspace.js'
// import axios from 'axios'
// const useWorkspaceStore = create((set) => ({
//   workspaces: [], currentWorkspace: null,
//   deleteWorkspace: async (id) => {
//   await axios.delete(`/workspaces/${id}`)
//   set(s => ({ workspaces: s.workspaces.filter(w => w._id !== id) }))
// },
//   fetchWorkspaces: async () => { const res = await getWorkspacesApi(); set({ workspaces: res.data.data.workspaces }) },
//   setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
//   createWorkspace: async (data) => { const res = await createWorkspaceApi(data); const workspace = res.data.data.workspace; set((state) => ({ workspaces: [...state.workspaces, workspace] })); return workspace }
// }))
// export default useWorkspaceStore

import { create } from 'zustand'
import { getWorkspacesApi, createWorkspaceApi } from '../api/workspace.js'
import api from '../api/axios.js'  // ← import your configured axios instance

const useWorkspaceStore = create((set) => ({
  workspaces: [], currentWorkspace: null,
  deleteWorkspace: async (id) => {
    await api.delete(`/workspaces/${id}`)  // ← use api, not axios
    set(s => ({ workspaces: s.workspaces.filter(w => w._id !== id) }))
  },
  fetchWorkspaces: async () => { const res = await getWorkspacesApi(); set({ workspaces: res.data.data.workspaces }) },
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  createWorkspace: async (data) => { const res = await createWorkspaceApi(data); const workspace = res.data.data.workspace; set((state) => ({ workspaces: [...state.workspaces, workspace] })); return workspace }
}))

export default useWorkspaceStore