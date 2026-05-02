import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Plus, X, Trash2, Sparkles, Flag, User, Calendar, MessageSquare, GripVertical } from 'lucide-react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getBoardApi } from '../api/board.js'
import { getTasksApi, createTaskApi, updateTaskApi, deleteTaskApi } from '../api/task.js'
import { connectSocket } from '../utils/socket.js'
import { useDroppable } from '@dnd-kit/core'

const priorityConfig = {
  low: { color: 'from-slate-500 to-slate-600', text: 'text-slate-300', bg: 'bg-slate-500/10', border: 'border-slate-500/30' },
  medium: { color: 'from-amber-500 to-yellow-500', text: 'text-amber-300', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
  high: { color: 'from-orange-500 to-red-500', text: 'text-orange-300', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  critical: { color: 'from-red-500 to-pink-600', text: 'text-red-300', bg: 'bg-red-500/10', border: 'border-red-500/30' }
}

function TaskCard({ task, onClick, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.3 : 1 }
  const p = priorityConfig[task.priority] || priorityConfig.medium

  return (
    <motion.div ref={setNodeRef} style={style} initial={{opacity:0, y:10}} animate={{opacity:1, y:0}}
      className='glass rounded-xl p-3.5 mb-2 hover:border-indigo-500/40 transition-all group cursor-pointer relative overflow-hidden'
      onClick={() => onClick(task)}>
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${p.color}`} />
      <div className='flex items-start gap-2 mb-2 ml-1'>
        <div {...attributes} {...listeners} className='opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-300 mt-0.5 transition-opacity'>
          <GripVertical size={14} />
        </div>
        <p className='text-sm text-white font-medium leading-snug flex-1'>{task.title}</p>
        <button onClick={(e) => { e.stopPropagation(); onDelete(task._id) }}
          className='opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all'><Trash2 size={12} /></button>
      </div>
      <div className='flex items-center justify-between ml-1'>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${p.bg} ${p.text} ${p.border} border text-[10px] font-medium uppercase tracking-wider`}>
          <Flag size={9} />{task.priority}
        </span>
        {task.assignee && (
          <div className='w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold' title={task.assignee.name}>
            {task.assignee.name[0]?.toUpperCase()}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function Column({ column, tasks, onAddTask, onTaskClick, onDeleteTask }) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')
  const handleAdd = async (e) => { e.preventDefault(); if (!title.trim()) return; await onAddTask(title, column.name, priority); setTitle(''); setPriority('medium'); setAdding(false) }
  const { setNodeRef: setDropRef } = useDroppable({ id: column.name })
  return (
    <div className='flex-shrink-0 w-80 glass rounded-2xl p-3 flex flex-col max-h-full'>
      <div className='flex items-center justify-between mb-3 px-2 sticky top-0'>
        <div className='flex items-center gap-2'>
          <div className='w-2.5 h-2.5 rounded-full' style={{ backgroundColor: column.color, boxShadow: `0 0 12px ${column.color}` }} />
          <span className='text-sm font-semibold text-white'>{column.name}</span>
          <span className='text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full font-medium'>{tasks.length}</span>
        </div>
        <motion.button whileHover={{scale:1.1, rotate:90}} onClick={() => setAdding(true)}
          className='w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition'><Plus size={12} /></motion.button>
      </div>
      <div className='overflow-y-auto scrollbar-thin flex-1 px-1'>
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => <TaskCard key={task._id} task={task} onClick={onTaskClick} onDelete={onDeleteTask} />)}
        </SortableContext>
        <AnimatePresence>
          {adding && (
            <motion.form initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}
              onSubmit={handleAdd} className='glass-strong rounded-xl p-3 mt-2'>
              <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
                className='w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-indigo-500'
                placeholder='Task title...' />
              <select value={priority} onChange={e => setPriority(e.target.value)}
                className='w-full bg-white/5 border border-white/10 text-white rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-indigo-500'>
                <option value='low'>🟦 Low</option>
                <option value='medium'>��� Medium</option>
                <option value='high'>🟧 High</option>
                <option value='critical'>🟥 Critical</option>
              </select>
              <div className='flex gap-2'>
                <button type='submit' className='flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs py-2 rounded-lg font-medium'>Add Task</button>
                <button type='button' onClick={() => setAdding(false)} className='bg-white/5 text-zinc-400 hover:text-white px-3 rounded-lg'><X size={14} /></button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        {tasks.length === 0 && !adding && (
          <button onClick={() => setAdding(true)} className='w-full py-6 text-zinc-600 hover:text-zinc-400 text-xs border border-dashed border-white/10 rounded-xl hover:border-white/20 transition'>
            + Add a task
          </button>
        )}
      </div>
    </div>
  )
}

export default function BoardPage() {
  const { workspaceId, projectId, boardId } = useParams()
  const navigate = useNavigate()
  const [board, setBoard] = useState(null)
  const [tasks, setTasks] = useState([])
  const [activeTask, setActiveTask] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    loadBoard(); loadTasks()
    const socket = connectSocket(); socket.emit('join_board', boardId)
    socket.on('task_created', ({ task }) => setTasks(prev => [...prev.filter(t => t._id !== task._id), task]))
    socket.on('task_updated', ({ task }) => setTasks(prev => prev.map(t => t._id === task._id ? task : t)))
    socket.on('task_deleted', ({ taskId }) => setTasks(prev => prev.filter(t => t._id !== taskId)))
    return () => { socket.emit('leave_board', boardId); socket.off('task_created'); socket.off('task_updated'); socket.off('task_deleted') }
  }, [boardId])

  const loadBoard = async () => { try { const r = await getBoardApi(workspaceId, projectId, boardId); setBoard(r.data.data.board) } catch { toast.error('Failed to load board') } }
  const loadTasks = async () => { try { const r = await getTasksApi(workspaceId, projectId, { boardId }); setTasks(r.data.data.tasks) } catch { toast.error('Failed to load tasks') } }

  const handleAddTask = async (title, status, priority) => {
    try { const r = await createTaskApi(workspaceId, projectId, { title, status, boardId, priority, type: 'task' }); setTasks(p => [...p, r.data.data.task]); toast.success('Task created!') }
    catch { toast.error('Failed') }
  }
  const handleDeleteTask = async (taskId) => {
    try { await deleteTaskApi(workspaceId, projectId, taskId); setTasks(p => p.filter(t => t._id !== taskId)); if (selectedTask?._id === taskId) setSelectedTask(null); toast.success('Task deleted') }
    catch { toast.error('Failed') }
  }
  const handleDragStart = (e) => setActiveTask(tasks.find(t => t._id === e.active.id))
  const handleDragEnd = async (e) => {
    const { active, over } = e; setActiveTask(null); if (!over) return
    const task = tasks.find(t => t._id === active.id); const overTask = tasks.find(t => t._id === over.id)
    if (!task) return; const newStatus = overTask ? overTask.status : over.id
    if (task.status === newStatus) return
    setTasks(tasks.map(t => t._id === active.id ? { ...t, status: newStatus } : t))
    try { await updateTaskApi(workspaceId, projectId, active.id, { status: newStatus }) } catch { toast.error('Failed') }
  }
  const getColumnTasks = (name) => tasks.filter(t => t.status === name)

  if (!board) return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 animate-pulse-glow'>
          <Sparkles className='w-8 h-8 text-white animate-pulse' />
        </div>
        <p className='text-zinc-400'>Loading your board...</p>
      </div>
    </div>
  )

  return (
    <div className='min-h-screen flex flex-col relative'>
      <div className='absolute inset-0 grid-bg opacity-20 pointer-events-none' />

      <nav className='relative glass-strong border-b border-white/5 px-6 py-4 flex items-center justify-between z-30'>
        <div className='flex items-center gap-4'>
          <motion.button whileHover={{scale:1.1, x:-2}} whileTap={{scale:0.95}}
            onClick={() => navigate('/')}
            className='w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition'>
            <ArrowLeft size={16} />
          </motion.button>
          <div>
            <h1 className='text-lg font-bold text-white'>{board.name}</h1>
            <p className='text-xs text-zinc-500'>Drag tasks between columns to update status</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <span className='inline-flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full'>
            <span className='w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse' /> Live sync
          </span>
          <span className='text-xs text-zinc-500'>{tasks.length} tasks</span>
        </div>
      </nav>

      <div className='flex-1 overflow-x-auto scrollbar-thin p-6 relative'>
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className='flex gap-4 h-full'>
            {board.columns.sort((a,b) => a.order - b.order).map(column => (
              <Column key={column._id} column={column} tasks={getColumnTasks(column.name)}
                onAddTask={handleAddTask} onTaskClick={setSelectedTask} onDeleteTask={handleDeleteTask} />
            ))}
          </div>
          <DragOverlay>
            {activeTask && (
              <div className='glass-strong rounded-xl p-3.5 w-72 rotate-3 shadow-2xl glow-purple'>
                <p className='text-sm text-white font-medium'>{activeTask.title}</p>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      <AnimatePresence>
        {selectedTask && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'
            onClick={() => setSelectedTask(null)}>
            <motion.div initial={{scale:0.9, y:20}} animate={{scale:1, y:0}} exit={{scale:0.9, y:20}}
              className='glass-strong rounded-2xl p-7 w-full max-w-2xl shadow-2xl' onClick={e => e.stopPropagation()}>
              <div className='flex items-start justify-between mb-6'>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md ${priorityConfig[selectedTask.priority]?.bg} ${priorityConfig[selectedTask.priority]?.text} ${priorityConfig[selectedTask.priority]?.border} border text-[10px] font-bold uppercase tracking-wider`}>
                      <Flag size={10} />{selectedTask.priority}
                    </span>
                    <span className='text-xs text-zinc-500'>· {selectedTask.type}</span>
                  </div>
                  <h2 className='text-2xl font-bold text-white'>{selectedTask.title}</h2>
                </div>
                <button onClick={() => setSelectedTask(null)} className='text-zinc-500 hover:text-white'><X size={20} /></button>
              </div>

              <div className='grid grid-cols-3 gap-4 mb-6'>
                <div className='glass rounded-xl p-3'>
                  <p className='text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5'>Status</p>
                  <p className='text-sm text-white font-medium'>{selectedTask.status}</p>
                </div>
                <div className='glass rounded-xl p-3'>
                  <p className='text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5'>Priority</p>
                  <p className='text-sm text-white font-medium capitalize'>{selectedTask.priority}</p>
                </div>
                <div className='glass rounded-xl p-3'>
                  <p className='text-[10px] text-zinc-500 uppercase tracking-wider mb-1.5'>Type</p>
                  <p className='text-sm text-white font-medium capitalize'>{selectedTask.type}</p>
                </div>
              </div>

              {selectedTask.description && (
                <div className='mb-6'>
                  <p className='text-[10px] text-zinc-500 uppercase tracking-wider mb-2'>Description</p>
                  <p className='text-sm text-zinc-300 leading-relaxed'>{selectedTask.description}</p>
                </div>
              )}

              <div className='space-y-3 mb-6'>
                <div className='flex items-center gap-3 text-sm'>
                  <User size={14} className='text-zinc-500' />
                  <span className='text-zinc-500 w-20'>Reporter</span>
                  <div className='flex items-center gap-2'>
                    <div className='w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold'>
                      {selectedTask.reporter?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className='text-white'>{selectedTask.reporter?.name}</span>
                  </div>
                </div>
                {selectedTask.assignee && (
                  <div className='flex items-center gap-3 text-sm'>
                    <User size={14} className='text-zinc-500' />
                    <span className='text-zinc-500 w-20'>Assignee</span>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white text-[10px] font-bold'>
                        {selectedTask.assignee.name[0]?.toUpperCase()}
                      </div>
                      <span className='text-white'>{selectedTask.assignee.name}</span>
                    </div>
                  </div>
                )}
                <div className='flex items-center gap-3 text-sm'>
                  <Calendar size={14} className='text-zinc-500' />
                  <span className='text-zinc-500 w-20'>Created</span>
                  <span className='text-white'>{new Date(selectedTask.createdAt).toLocaleDateString('en-US', { day:'numeric', month:'long', year:'numeric' })}</span>
                </div>
              </div>

              <div className='pt-4 border-t border-white/5 flex items-center justify-between'>
                <button onClick={() => { handleDeleteTask(selectedTask._id); setSelectedTask(null) }}
                  className='inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-500/10 transition'>
                  <Trash2 size={14} /> Delete Task
                </button>
                <button onClick={() => setSelectedTask(null)} className='bg-white/5 hover:bg-white/10 text-white text-sm font-medium px-4 py-2 rounded-lg'>Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}