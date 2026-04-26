import { create } from 'zustand'
import { getWorkspacesApi, createWorkspaceApi } from '../api/workspace.js'
const useWorkspaceStore = create((set) => ({
  workspaces: [], currentWorkspace: null,
  fetchWorkspaces: async () => { const res = await getWorkspacesApi(); set({ workspaces: res.data.data.workspaces }) },
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  createWorkspace: async (data) => { const res = await createWorkspaceApi(data); const workspace = res.data.data.workspace; set((state) => ({ workspaces: [...state.workspaces, workspace] })); return workspace }
}))
export default useWorkspaceStore