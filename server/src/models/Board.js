import mongoose from 'mongoose'

const columnSchema = new mongoose.Schema({
  name: { type: String, required: true },
  order: { type: Number, default: 0 },
  color: { type: String, default: '#E2E8F0' }
}, { _id: true })

const boardSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Board name is required'], trim: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  columns: {
    type: [columnSchema],
    default: [
      { name: 'To Do', order: 0, color: '#E2E8F0' },
      { name: 'In Progress', order: 1, color: '#BEE3F8' },
      { name: 'In Review', order: 2, color: '#FEFCBF' },
      { name: 'Done', order: 3, color: '#C6F6D5' }
    ]
  }
}, { timestamps: true })

const Board = mongoose.model('Board', boardSchema)
export default Board
