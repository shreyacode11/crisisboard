import mongoose from 'mongoose'

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: true })

const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Task title is required'], trim: true },
  description: { type: String, default: '' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  sprint: { type: mongoose.Schema.Types.ObjectId, ref: 'Sprint', default: null },
  assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'To Do' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  type: { type: String, enum: ['task', 'bug', 'story', 'epic'], default: 'task' },
  order: { type: Number, default: 0 },
  dueDate: { type: Date, default: null },
  attachments: [{ url: String, name: String, uploadedAt: { type: Date, default: Date.now } }],
  comments: [commentSchema],
  labels: [{ type: String }],
  storyPoints: { type: Number, default: 0 }
}, { timestamps: true })

const Task = mongoose.model('Task', taskSchema)
export default Task
