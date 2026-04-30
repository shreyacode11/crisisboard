import { API_URL } from './config'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Plus, LogOut, Layout } from 'lucide-react'
import useAuthStore from '../store/authStore.js'
import useWorkspaceStore from '../store/workspaceStore.js'
import { getProjectsApi, createProjectApi } from '../api/project.js'
import { createBoardApi, getBoardsApi } from '../api/board.js'
export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const { workspaces, fetchWorkspaces, createWorkspace } = useWorkspaceStore()
  const [projects, setProjects] = useState([])
  const [selectedWs, setSelectedWs] = useState(null)
  const [showWsForm, setShowWsForm] = useState(false)
  const [showProjForm, setShowProjForm] = useState(false)
  const [wsName, setWsName] = useState('')
  const [projName, setProjName] = useState('')
  const navigate = useNavigate()
  useEffect(() => { fetchWorkspaces() }, [])
  useEffect(() => { if (selectedWs) loadProjects(selectedWs._id) }, [selectedWs])
  const loadProjects = async (wsId) => { try { const res = await getProjectsApi(wsId); setProjects(res.data.data.projects) } catch { toast.error('Failed to load projects') } }
  const handleCreateWs = async (e) => { e.preventDefault(); try { const ws = await createWorkspace({ name: wsName }); setSelectedWs(ws); setWsName(''); setShowWsForm(false); toast.success('Workspace created!') } catch { toast.error('Failed') } }
  const handleCreateProj = async (e) => { e.preventDefault(); try { const res = await createProjectApi(selectedWs._id, { name: projName }); const project = res.data.data.project; const boardRes = await createBoardApi(selectedWs._id, project._id, { name: 'Main Board' }); const board = boardRes.data.data.board; setProjects(prev => [...prev, project]); setProjName(''); setShowProjForm(false); toast.success('Project created!'); navigate(`/board/${selectedWs._id}/${project._id}/${board._id}`) } catch { toast.error('Failed') } }
  const openBoard = async (project) => { try { const res = await getBoardsApi(selectedWs._id, project._id); const boards = res.data.data.boards; if (boards.length > 0) { navigate(`/board/${selectedWs._id}/${project._id}/${boards[0]._id}`) } else { const boardRes = await createBoardApi(selectedWs._id, project._id, { name: 'Main Board' }); navigate(`/board/${selectedWs._id}/${project._id}/${boardRes.data.data.board._id}`) } } catch { toast.error('Failed to open board') } }
  const handleLogout = async () => { await logout(); navigate('/login') }
  return (<div className='min-h-screen bg-gray-950 text-white'>
    <nav className='bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between'>
      <h1 className='text-xl font-bold text-blue-400'>CrisisBoard</h1>
      <div className='flex items-center gap-4'><span className='text-gray-400 text-sm'>{user?.name}</span>
        <button onClick={handleLogout} className='flex items-center gap-2 text-gray-400 hover:text-white transition-colors'><LogOut size={16} /> Logout</button></div>
    </nav>
    <div className='flex h-[calc(100vh-65px)]'>
      <aside className='w-64 bg-gray-900 border-r border-gray-800 p-4'>
        <div className='flex items-center justify-between mb-4'><span className='text-xs font-semibold text-gray-500 uppercase tracking-wider'>Workspaces</span>
          <button onClick={() => setShowWsForm(true)} className='text-gray-400 hover:text-white'><Plus size={16} /></button></div>
        {showWsForm && (<form onSubmit={handleCreateWs} className='mb-4'>
          <input autoFocus value={wsName} onChange={e => setWsName(e.target.value)} className='w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 text-sm mb-2 focus:outline-none focus:border-blue-500' placeholder='Workspace name' />
          <div className='flex gap-2'><button type='submit' className='flex-1 bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700'>Create</button>
            <button type='button' onClick={() => setShowWsForm(false)} className='flex-1 bg-gray-700 text-white text-xs py-1.5 rounded'>Cancel</button></div></form>)}
        {workspaces.map(ws => (<button key={ws._id} onClick={() => setSelectedWs(ws)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm mb-1 transition-colors ${selectedWs?._id === ws._id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>{ws.name}</button>))}
      </aside>
      <main className='flex-1 p-8 overflow-auto'>
        {!selectedWs ? (<div className='flex flex-col items-center justify-center h-full text-center'>
          <Layout size={48} className='text-gray-700 mb-4' /><h2 className='text-xl font-semibold text-gray-400 mb-2'>Select a workspace</h2>
          <p className='text-gray-600'>Choose a workspace from the sidebar or create a new one</p></div>
        ) : (<div>
          <div className='flex items-center justify-between mb-6'><h2 className='text-2xl font-bold'>{selectedWs.name}</h2>
            <button onClick={() => setShowProjForm(true)} className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors'><Plus size={16} /> New Project</button></div>
          {showProjForm && (<form onSubmit={handleCreateProj} className='bg-gray-900 border border-gray-800 rounded-xl p-4 mb-6'>
            <input autoFocus value={projName} onChange={e => setProjName(e.target.value)} className='w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 text-sm mb-3 focus:outline-none focus:border-blue-500' placeholder='Project name' />
            <div className='flex gap-2'><button type='submit' className='bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700'>Create</button>
              <button type='button' onClick={() => setShowProjForm(false)} className='bg-gray-700 text-white text-sm px-4 py-2 rounded'>Cancel</button></div></form>)}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {projects.map(project => (<div key={project._id} onClick={() => openBoard(project)}
              className='bg-gray-900 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-blue-500 transition-colors group'>
              <div className='flex items-center gap-3 mb-3'><div className='w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-xs font-bold'>{project.identifier}</div>
                <h3 className='font-semibold group-hover:text-blue-400 transition-colors'>{project.name}</h3></div>
              <p className='text-gray-500 text-sm'>{project.description || 'No description'}</p></div>))}
          </div></div>)}
      </main></div></div>)
}