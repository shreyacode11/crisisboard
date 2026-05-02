import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, LogOut, LayoutGrid, Sparkles, Folder, Users, Clock, Zap, X,Trash2 } from 'lucide-react'
import useAuthStore from '../store/authStore.js'
import useWorkspaceStore from '../store/workspaceStore.js'

import { createBoardApi, getBoardsApi } from '../api/board.js'
import { getProjectsApi, createProjectApi, deleteProjectApi } from '../api/project.js'


const gradients = [
  'from-indigo-500 to-purple-500',
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
  'from-orange-500 to-pink-500',
  'from-violet-500 to-fuchsia-500'
]

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const { workspaces, fetchWorkspaces, createWorkspace ,deleteWorkspace} = useWorkspaceStore()
  const [projects, setProjects] = useState([])
  const [selectedWs, setSelectedWs] = useState(null)
  const [showWsForm, setShowWsForm] = useState(false)
  const [showProjForm, setShowProjForm] = useState(false)
  const [wsName, setWsName] = useState('')
  const [projName, setProjName] = useState('')
  const [projDesc, setProjDesc] = useState('')
  const navigate = useNavigate()

  useEffect(() => { fetchWorkspaces() }, [])
  useEffect(() => { if (selectedWs) loadProjects(selectedWs._id); else setProjects([]) }, [selectedWs])

  const loadProjects = async (wsId) => { try { const res = await getProjectsApi(wsId); setProjects(res.data.data.projects) } catch { toast.error('Failed to load projects') } }

  const handleCreateWs = async (e) => {
    e.preventDefault(); if (!wsName.trim()) return
    try { const ws = await createWorkspace({ name: wsName }); setSelectedWs(ws); setWsName(''); setShowWsForm(false); toast.success('Workspace created!') }
    catch { toast.error('Failed') }
  }

  const deleteProjectFn = async (projectId) => {
  try {
    await deleteProjectApi(selectedWs._id, projectId)
    setProjects(p => p.filter(proj => proj._id !== projectId))
    toast.success('Project deleted')
  } catch {
    toast.error('Failed to delete project')
  }
}

const handleCreateProj = async (e) => {    
    e.preventDefault(); if (!projName.trim()) return
    try {
      const res = await createProjectApi(selectedWs._id, { name: projName, description: projDesc })
      const project = res.data.data.project
      const boardRes = await createBoardApi(selectedWs._id, project._id, { name: 'Main Board' })
      setProjects(p => [...p, project]); setProjName(''); setProjDesc(''); setShowProjForm(false)
      toast.success('Project created!')
      navigate(`/board/${selectedWs._id}/${project._id}/${boardRes.data.data.board._id}`)
    } catch { toast.error('Failed') }
  }

  const openBoard = async (project) => {
    try {
      const res = await getBoardsApi(selectedWs._id, project._id)
      const boards = res.data.data.boards
      if (boards.length > 0) navigate(`/board/${selectedWs._id}/${project._id}/${boards[0]._id}`)
      else { const r = await createBoardApi(selectedWs._id, project._id, { name: 'Main Board' }); navigate(`/board/${selectedWs._id}/${project._id}/${r.data.data.board._id}`) }
    } catch { toast.error('Failed to open board') }
  }

  const handleLogout = async () => { await logout(); navigate('/login') }

  return (
    <div className='min-h-screen relative'>
      <div className='absolute inset-0 grid-bg opacity-20 pointer-events-none' />

      <nav className='relative glass-strong border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 z-40'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center'>
            <Sparkles className='w-5 h-5 text-white' />
          </div>
          <h1 className='text-xl font-bold gradient-text'>CrisisBoard</h1>
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/5'>
            <div className='w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm'>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className='text-zinc-300 text-sm font-medium'>{user?.name}</span>
          </div>
          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
            onClick={handleLogout}
            className='flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all'>
            <LogOut size={16} /> Logout
          </motion.button>
        </div>
      </nav>

      <div className='flex h-[calc(100vh-73px)]'>
        <aside className='w-72 glass border-r border-white/5 p-5 overflow-y-auto scrollbar-thin'>
          <div className='flex items-center justify-between mb-5'>
            <h2 className='text-xs font-bold text-zinc-500 uppercase tracking-widest'>Workspaces</h2>
            <motion.button whileHover={{scale:1.1, rotate:90}} whileTap={{scale:0.9}}
              onClick={() => setShowWsForm(true)}
              className='w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg glow-purple'>
              <Plus size={14} />
            </motion.button>
            
          </div>

          <AnimatePresence>
            {showWsForm && (
              <motion.form initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}}
                onSubmit={handleCreateWs} className='mb-4 overflow-hidden'>
                <div className='glass-strong rounded-xl p-3'>
                  <input autoFocus value={wsName} onChange={e => setWsName(e.target.value)}
                    className='w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                    placeholder='Workspace name' />
                  <div className='flex gap-2'>
                    <button type='submit' className='flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs py-2 rounded-lg font-medium hover:opacity-90 transition'>Create</button>
                    <button type='button' onClick={() => setShowWsForm(false)} className='flex-1 bg-white/5 hover:bg-white/10 text-zinc-300 text-xs py-2 rounded-lg transition'>Cancel</button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className='space-y-1'>
            {workspaces.map((ws, i) => (
              
              <motion.button key={ws._id} initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay:i*0.05}}
                onClick={() => setSelectedWs(ws)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 group ${selectedWs?._id === ws._id
                  ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-white'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white border border-transparent'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${selectedWs?._id === ws._id ? 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white' : 'bg-white/5 text-zinc-400 group-hover:bg-white/10'}`}>
                  {ws.name[0]?.toUpperCase()}
                </div>
                <span className='font-medium truncate flex-1'>{ws.name}</span>

<button
  onClick={e => {
    e.stopPropagation()
    if (confirm('Delete workspace?')) {
      deleteWorkspace(ws._id)
      if (selectedWs?._id === ws._id) setSelectedWs(null)
    }
  }}
  className='opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition ml-1'
>
  <Trash2 size={12} />
</button>
              </motion.button>
              
            ))}
            {workspaces.length === 0 && !showWsForm && (
              <div className='text-center py-8'>
                <Folder className='w-10 h-10 text-zinc-700 mx-auto mb-2' />
                <p className='text-zinc-600 text-xs'>No workspaces yet</p>
              </div>
            )}
          </div>
        </aside>

        <main className='flex-1 overflow-auto scrollbar-thin'>
          {!selectedWs ? (
            <div className='flex flex-col items-center justify-center h-full text-center px-6'>
              <motion.div initial={{scale:0, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'spring'}}
                className='relative mb-6'>
                <div className='absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 blur-3xl opacity-20' />
                <div className='relative w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center'>
                  <LayoutGrid className='w-12 h-12 text-indigo-400' />
                </div>
              </motion.div>
              <h2 className='text-3xl font-bold mb-3'><span className='gradient-text'>Welcome back, {user?.name?.split(' ')[0]}</span></h2>
              <p className='text-zinc-500 max-w-md'>Select a workspace from the sidebar or create a new one to start managing your projects.</p>
            </div>
          ) : (
            <div className='p-8 max-w-7xl mx-auto'>
              <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}
                className='flex items-center justify-between mb-8'>
                <div>
                  <div className='flex items-center gap-3 mb-2'>
                    <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold'>
                      {selectedWs.name[0]?.toUpperCase()}
                    </div>
                    <h1 className='text-3xl font-bold text-white'>{selectedWs.name}</h1>
                  </div>
                  <p className='text-zinc-500 text-sm ml-13'>Manage projects and track progress</p>
                </div>
                <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}}
                  onClick={() => setShowProjForm(true)}
                  className='flex items-center gap-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-5 py-3 rounded-xl font-medium text-sm shadow-lg glow-purple'>
                  <Plus size={16} /> New Project
                </motion.button>
              </motion.div>

              <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}}
                  className='glass rounded-2xl p-5 hover:border-indigo-500/30 transition-all'>
                  <div className='flex items-center justify-between mb-2'>
                    <Folder className='w-5 h-5 text-indigo-400' />
                    <span className='text-xs text-zinc-500'>Total</span>
                  </div>
                  <p className='text-3xl font-bold text-white mb-1'>{projects.length}</p>
                  <p className='text-xs text-zinc-500'>Projects</p>
                </motion.div>
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.15}}
                  className='glass rounded-2xl p-5 hover:border-purple-500/30 transition-all'>
                  <div className='flex items-center justify-between mb-2'>
                    <Users className='w-5 h-5 text-purple-400' />
                    <span className='text-xs text-zinc-500'>Members</span>
                  </div>
                  <p className='text-3xl font-bold text-white mb-1'>{selectedWs.members?.length || 1}</p>
                  <p className='text-xs text-zinc-500'>Active members</p>
                </motion.div>
                <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}}
                  className='glass rounded-2xl p-5 hover:border-pink-500/30 transition-all'>
                  <div className='flex items-center justify-between mb-2'>
                    <Zap className='w-5 h-5 text-pink-400' />
                    <span className='text-xs text-zinc-500'>Status</span>
                  </div>
                  <p className='text-3xl font-bold text-white mb-1'>Live</p>
                  <p className='text-xs text-emerald-400 flex items-center gap-1'><span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse'></span>Real-time sync active</p>
                </motion.div>
              </div>

              <AnimatePresence>
                {showProjForm && (
                  <motion.form initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}}
                    onSubmit={handleCreateProj} className='glass-strong rounded-2xl p-5 mb-6 overflow-hidden'>
                    <div className='flex items-center justify-between mb-4'>
                      <h3 className='text-white font-semibold'>Create New Project</h3>
                      <button type='button' onClick={() => setShowProjForm(false)} className='text-zinc-500 hover:text-white'><X size={18} /></button>
                    </div>
                    <input autoFocus value={projName} onChange={e => setProjName(e.target.value)}
                      className='w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                      placeholder='Project name' />
                    <textarea value={projDesc} onChange={e => setProjDesc(e.target.value)}
                      className='w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 text-sm mb-3 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none'
                      rows={2} placeholder='Description (optional)' />
                    <div className='flex gap-2'>
                      <button type='submit' className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm px-5 py-2.5 rounded-xl font-medium hover:opacity-90'>Create Project</button>
                      <button type='button' onClick={() => setShowProjForm(false)} className='bg-white/5 hover:bg-white/10 text-zinc-300 text-sm px-5 py-2.5 rounded-xl'>Cancel</button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                {projects.map((project, i) => (
                  <motion.div key={project._id} initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:i*0.05}}
                    whileHover={{y:-4}} onClick={() => openBoard(project)}
                    className='glass rounded-2xl p-5 cursor-pointer hover:border-indigo-500/40 transition-all group relative overflow-hidden'>
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradients[i % gradients.length]} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    <div className='relative'>
                      <button
  onClick={e => {
    e.stopPropagation()
    if (confirm('Delete project?')) deleteProjectFn(project._id)
  }}
  className='absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition'
>
  <Trash2 size={14} />
</button>
                      <div className='flex items-center gap-3 mb-4'>
                        <div className={`w-10 h-10 bg-gradient-to-br ${gradients[i % gradients.length]} rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
                          {project.identifier}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h3 className='font-semibold text-white truncate group-hover:text-indigo-400 transition-colors'>{project.name}</h3>
                          <p className='text-xs text-zinc-500'>{project.identifier}</p>
                        </div>
                      </div>
                      <p className='text-zinc-500 text-sm line-clamp-2 mb-4 min-h-[40px]'>{project.description || 'No description provided'}</p>
                      <div className='flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-white/5'>
                        <span className='flex items-center gap-1'><Clock size={12} />{new Date(project.createdAt).toLocaleDateString()}</span>
                        <span className='px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs'>● {project.status}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {projects.length === 0 && !showProjForm && (
                <motion.div initial={{opacity:0}} animate={{opacity:1}}
                  className='text-center py-16'>
                  <Folder className='w-16 h-16 text-zinc-700 mx-auto mb-4' />
                  <h3 className='text-xl font-semibold text-zinc-400 mb-2'>No projects yet</h3>
                  <p className='text-zinc-600 text-sm mb-6'>Create your first project to get started</p>
                  <button onClick={() => setShowProjForm(true)} className='inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2.5 rounded-xl font-medium text-sm'><Plus size={16} /> New Project</button>
                </motion.div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}