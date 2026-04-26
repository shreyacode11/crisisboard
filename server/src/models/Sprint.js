import mongoose from 'mongoose'

const sprintSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Sprint name is required'], trim: true },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  status: { type: String, enum: ['planning', 'active', 'completed'], default: 'planning' },
  startDate: { type: Date },
  endDate: { type: Date },
  goal: { type: String, default: '' }
}, { timestamps: true })

const Sprint = mongoose.model('Sprint', sprintSchema)
export default Sprint
