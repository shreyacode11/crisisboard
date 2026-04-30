// import { API_URL } from '../config'
// import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core'
// import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
// import { useDroppable } from '@dnd-kit/core'
// import { useEffect, useState } from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { toast } from 'sonner'
// import { ArrowLeft, Plus, X, Trash2 } from 'lucide-react'
// import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core'
// import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
// import { CSS } from '@dnd-kit/utilities'
// import { getBoardApi } from '../api/board.js'
// import { getTasksApi, createTaskApi, updateTaskApi, deleteTaskApi } from '../api/task.js'
// import { connectSocket, disconnectSocket } from '../utils/socket.js'

// function TaskCard({ task, onClick, onDelete }) {
//   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id })
//   const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }
//   const priorityColors = { low: 'bg-gray-600', medium: 'bg-yellow-600', high: 'bg-orange-600', critical: 'bg-red-600' }
//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}
//       className='bg-gray-800 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors mb-2 group'>
//       <div className='flex items-start justify-between gap-2 mb-2'>
//         <p onClick={() => onClick(task)} className='text-sm text-white font-medium leading-snug flex-1'>{task.title}</p>
//         <div className='flex items-center gap-1'>
//           <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded text-white ${priorityColors[task.priority]}`}>{task.priority}</span>
//           <button onClick={(e) => { e.stopPropagation(); onDelete(task._id) }} className='opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all'><Trash2 size={12} /></button>
//         </div>
//       </div>
//       {task.assignee && <p className='text-xs text-gray-500'>@{task.assignee.name}</p>}
//     </div>
//   )
// }

// function Column({ column, tasks, onAddTask, onTaskClick, onDeleteTask }) {
//   const [adding, setAdding] = useState(false)
//   const [title, setTitle] = useState('')
//   const [priority, setPriority] = useState('medium')

//   const { setNodeRef } = useDroppable({ id: column.name })

//   const handleAdd = async (e) => { e.preventDefault(); if (!title.trim()) return; await onAddTask(title, column.name, priority); setTitle(''); setPriority('medium'); setAdding(false) }

//   return (
//     <div className='shrink-0 w-72 bg-gray-900 rounded-xl p-3'>
//       <div className='flex items-center justify-between mb-3'>
//         <div className='flex items-center gap-2'>
//           <div className='w-2 h-2 rounded-full' style={{ backgroundColor: column.color }} />
//           <span className='text-sm font-semibold text-gray-300'>{column.name}</span>
//           <span className='text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded-full'>{tasks.length}</span>
//         </div>
//         <button onClick={() => setAdding(true)} className='text-gray-600 hover:text-white transition-colors'><Plus size={14} /></button>
//       </div>
//       <div ref={setNodeRef} className='min-h-[40px]'>
//         <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
//           {tasks.map(task => <TaskCard key={task._id} task={task} onClick={onTaskClick} onDelete={onDeleteTask} />)}
//         </SortableContext>
//       </div>
//       {adding && (
//         <form onSubmit={handleAdd} className='mt-2 bg-gray-800 rounded-lg p-3'>
//           <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
//             className='w-full bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 text-sm mb-2 focus:outline-none focus:border-blue-500'
//             placeholder='Task title...' />
//           <select value={priority} onChange={e => setPriority(e.target.value)}
//             className='w-full bg-gray-700 border border-gray-600 text-white rounded px-3 py-2 text-sm mb-2 focus:outline-none'>
//             <option value='low'>Low</option><option value='medium'>Medium</option>
//             <option value='high'>High</option><option value='critical'>Critical</option>
//           </select>
//           <div className='flex gap-2'>
//             <button type='submit' className='flex-1 bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700'>Add</button>
//             <button type='button' onClick={() => setAdding(false)} className='text-gray-500 hover:text-white'><X size={16} /></button>
//           </div>
//         </form>
//       )}
//     </div>
//   )
// }
// export default function BoardPage() {
//   const { workspaceId, projectId, boardId } = useParams()
//   const navigate = useNavigate()
//   const [board, setBoard] = useState(null)
//   const [tasks, setTasks] = useState([])
//   const [activeTask, setActiveTask] = useState(null)
//   const [selectedTask, setSelectedTask] = useState(null)
//   const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

//   useEffect(() => {
//     loadBoard()
//     loadTasks()
//     const socket = connectSocket()
//     socket.emit('join_board', boardId)
//     socket.on('task_created', ({ task }) => setTasks(prev => [...prev.filter(t => t._id !== task._id), task]))
//     socket.on('task_updated', ({ task }) => setTasks(prev => prev.map(t => t._id === task._id ? task : t)))
//     socket.on('task_deleted', ({ taskId }) => setTasks(prev => prev.filter(t => t._id !== taskId)))
//     return () => { socket.emit('leave_board', boardId); socket.off('task_created'); socket.off('task_updated'); socket.off('task_deleted') }
//   }, [boardId])

//   const loadBoard = async () => { try { const res = await getBoardApi(workspaceId, projectId, boardId); setBoard(res.data.data.board) } catch { toast.error('Failed to load board') } }
//   const loadTasks = async () => { try { const res = await getTasksApi(workspaceId, projectId, { boardId }); setTasks(res.data.data.tasks) } catch { toast.error('Failed to load tasks') } }

//   const handleAddTask = async (title, status, priority) => {
//     try {
//       const res = await createTaskApi(workspaceId, projectId, { title, status, boardId, priority, type: 'task' })
//       setTasks(prev => [...prev, res.data.data.task])
//       toast.success('Task created!')
//     } catch { toast.error('Failed to create task') }
//   }

//   const handleDeleteTask = async (taskId) => {
//     try {
//       await deleteTaskApi(workspaceId, projectId, taskId)
//       setTasks(prev => prev.filter(t => t._id !== taskId))
//       if (selectedTask?._id === taskId) setSelectedTask(null)
//       toast.success('Task deleted')
//     } catch { toast.error('Failed to delete task') }
//   }

//   const handleDragStart = (event) => { setActiveTask(tasks.find(t => t._id === event.active.id)) }
//   const handleDragEnd = async (event) => {
//   const { active, over } = event
//   setActiveTask(null)
//   if (!over) return
//   const task = tasks.find(t => t._id === active.id)
//   if (!task) return
//   const overTask = tasks.find(t => t._id === over.id)
//   const newStatus = overTask ? overTask.status : over.id
//   if (task.status === newStatus) return
//   setTasks(prev => prev.map(t => t._id === active.id ? { ...t, status: newStatus } : t))
//   try { await updateTaskApi(workspaceId, projectId, active.id, { status: newStatus }) } catch { toast.error('Failed to update') }
// }

//   const getColumnTasks = (name) => tasks.filter(t => t.status === name)

//   if (!board) return <div className='min-h-screen bg-gray-950 flex items-center justify-center text-white'>Loading...</div>

//   return (
//     <div className='min-h-screen bg-gray-950 text-white flex flex-col'>
//       <nav className='bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4'>
//         <button onClick={() => navigate('/')} className='text-gray-400 hover:text-white'><ArrowLeft size={20} /></button>
//         <h1 className='text-lg font-semibold'>{board.name}</h1>
//         <span className='text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full'>● Live</span>
//       </nav>
//       <div className='flex-1 overflow-x-auto p-6'>
//         <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
//           <div className='flex gap-4'>
//             {board.columns.sort((a,b) => a.order - b.order).map(column => (
//               <Column key={column._id} column={column} tasks={getColumnTasks(column.name)}
//                 onAddTask={handleAddTask} onTaskClick={setSelectedTask} onDeleteTask={handleDeleteTask} />
//             ))}
//           </div>
//           <DragOverlay>
//             {activeTask && <div className='bg-gray-800 border border-blue-500 rounded-lg p-3 w-72 shadow-2xl opacity-90'><p className='text-sm text-white'>{activeTask.title}</p></div>}
//           </DragOverlay>
//         </DndContext>
//       </div>
//       {selectedTask && (
//         <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4' onClick={() => setSelectedTask(null)}>
//           <div className='bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg' onClick={e => e.stopPropagation()}>
//             <div className='flex items-start justify-between mb-4'>
//               <h2 className='text-lg font-semibold'>{selectedTask.title}</h2>
//               <button onClick={() => setSelectedTask(null)} className='text-gray-500 hover:text-white'><X size={20} /></button>
//             </div>
//             <div className='space-y-4 text-sm'>
//               <div className='flex gap-6'>
//                 <div><p className='text-gray-500 text-xs mb-1'>STATUS</p><p className='text-white'>{selectedTask.status}</p></div>
//                 <div><p className='text-gray-500 text-xs mb-1'>PRIORITY</p><p className='text-white capitalize'>{selectedTask.priority}</p></div>
//                 <div><p className='text-gray-500 text-xs mb-1'>TYPE</p><p className='text-white capitalize'>{selectedTask.type}</p></div>
//               </div>
//               {selectedTask.description && <div><p className='text-gray-500 text-xs mb-1'>DESCRIPTION</p><p className='text-white'>{selectedTask.description}</p></div>}
//               <div><p className='text-gray-500 text-xs mb-1'>REPORTER</p><p className='text-white'>{selectedTask.reporter?.name}</p></div>
//               {selectedTask.assignee && <div><p className='text-gray-500 text-xs mb-1'>ASSIGNEE</p><p className='text-white'>{selectedTask.assignee.name}</p></div>}
//               <div className='pt-2 border-t border-gray-800'>
//                 <button onClick={() => { handleDeleteTask(selectedTask._id); setSelectedTask(null) }}
//                   className='flex items-center gap-2 text-red-400 hover:text-red-300 text-sm transition-colors'>
//                   <Trash2 size={14} /> Delete Task
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, closestCorners, useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { getBoardApi } from '../api/board.js'
import { getTasksApi, createTaskApi, updateTaskApi } from '../api/task.js'

function TaskCard({ task, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }
  const priorityColors = { low: 'bg-gray-600', medium: 'bg-yellow-600', high: 'bg-orange-600', critical: 'bg-red-600' }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={() => onClick(task)}
      className='bg-gray-800 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-blue-500 transition-colors mb-2'>
      <div className='flex items-start justify-between gap-2 mb-2'>
        <p className='text-sm text-white font-medium leading-snug'>{task.title}</p>
        <span className={`shrink-0 text-xs px-1.5 py-0.5 rounded text-white ${priorityColors[task.priority]}`}>{task.priority}</span>
      </div>
      {task.assignee && <p className='text-xs text-gray-500'>@{task.assignee.name}</p>}
    </div>
  )
}

function Column({ column, tasks, onAddTask, onTaskClick }) {
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const { setNodeRef } = useDroppable({ id: column.name })
  const handleAdd = async (e) => { e.preventDefault(); if (!title.trim()) return; await onAddTask(title, column.name); setTitle(''); setAdding(false) }

  return (
    <div className='flex-shrink-0 w-72 bg-gray-900 rounded-xl p-3'>
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <div className='w-2 h-2 rounded-full' style={{ backgroundColor: column.color }} />
          <span className='text-sm font-semibold text-gray-300'>{column.name}</span>
          <span className='text-xs text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded-full'>{tasks.length}</span>
        </div>
        <button onClick={() => setAdding(true)} className='text-gray-600 hover:text-white transition-colors'><Plus size={14} /></button>
      </div>
      <div ref={setNodeRef} className='min-h-[2px]'>
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => <TaskCard key={task._id} task={task} onClick={onTaskClick} />)}
        </SortableContext>
      </div>
      {adding && (
        <form onSubmit={handleAdd} className='mt-2'>
          <input autoFocus value={title} onChange={e => setTitle(e.target.value)}
            className='w-full bg-gray-800 border border-gray-700 text-white rounded px-3 py-2 text-sm mb-2 focus:outline-none focus:border-blue-500' placeholder='Task title...' />
          <div className='flex gap-2'>
            <button type='submit' className='flex-1 bg-blue-600 text-white text-xs py-1.5 rounded hover:bg-blue-700'>Add</button>
            <button type='button' onClick={() => setAdding(false)} className='text-gray-500 hover:text-white'><X size={16} /></button>
          </div>
        </form>
      )}
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

  useEffect(() => { loadBoard(); loadTasks() }, [boardId])

  const loadBoard = async () => { try { const res = await getBoardApi(workspaceId, projectId, boardId); setBoard(res.data.data.board) } catch { toast.error('Failed to load board') } }
  const loadTasks = async () => { try { const res = await getTasksApi(workspaceId, projectId, { boardId }); setTasks(res.data.data.tasks) } catch { toast.error('Failed to load tasks') } }
  const handleAddTask = async (title, status) => { try { const res = await createTaskApi(workspaceId, projectId, { title, status, boardId, priority: 'medium', type: 'task' }); setTasks(prev => [...prev, res.data.data.task]); toast.success('Task created!') } catch { toast.error('Failed to create task') } }
  const handleDragStart = (event) => { setActiveTask(tasks.find(t => t._id === event.active.id)) }

  const handleDragEnd = async (event) => {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return
    const task = tasks.find(t => t._id === active.id)
    if (!task) return
    const overTask = tasks.find(t => t._id === over.id)
    const newStatus = overTask ? overTask.status : over.id
    if (task.status === newStatus) return
    setTasks(tasks.map(t => t._id === active.id ? { ...t, status: newStatus } : t))
    try { await updateTaskApi(workspaceId, projectId, active.id, { status: newStatus }) } catch { toast.error('Failed to update') }
  }

  const getColumnTasks = (name) => tasks.filter(t => t.status === name)

  if (!board) return <div className='min-h-screen bg-gray-950 flex items-center justify-center text-white'>Loading...</div>

  return (
    <div className='min-h-screen bg-gray-950 text-white flex flex-col'>
      <nav className='bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center gap-4'>
        <button onClick={() => navigate('/')} className='text-gray-400 hover:text-white transition-colors'><ArrowLeft size={20} /></button>
        <h1 className='text-lg font-semibold'>{board.name}</h1>
      </nav>
      <div className='flex-1 overflow-x-auto p-6'>
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className='flex gap-4'>
            {board.columns.sort((a, b) => a.order - b.order).map(column => (
              <Column key={column._id} column={column} tasks={getColumnTasks(column.name)} onAddTask={handleAddTask} onTaskClick={setSelectedTask} />
            ))}
          </div>
          <DragOverlay>
            {activeTask && <div className='bg-gray-800 border border-blue-500 rounded-lg p-3 w-72 shadow-2xl'><p className='text-sm text-white'>{activeTask.title}</p></div>}
          </DragOverlay>
        </DndContext>
      </div>
      {selectedTask && (
        <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4'>
          <div className='bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-lg'>
            <div className='flex items-start justify-between mb-4'>
              <h2 className='text-lg font-semibold'>{selectedTask.title}</h2>
              <button onClick={() => setSelectedTask(null)} className='text-gray-500 hover:text-white'><X size={20} /></button>
            </div>
            <div className='space-y-3 text-sm text-gray-400'>
              <div className='flex gap-6'>
                <div><span className='text-gray-600'>Status</span><p className='text-white mt-1'>{selectedTask.status}</p></div>
                <div><span className='text-gray-600'>Priority</span><p className='text-white mt-1 capitalize'>{selectedTask.priority}</p></div>
                <div><span className='text-gray-600'>Type</span><p className='text-white mt-1 capitalize'>{selectedTask.type}</p></div>
              </div>
              {selectedTask.description && <div><span className='text-gray-600'>Description</span><p className='text-white mt-1'>{selectedTask.description}</p></div>}
              {selectedTask.assignee && <div><span className='text-gray-600'>Assignee</span><p className='text-white mt-1'>{selectedTask.assignee.name}</p></div>}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}