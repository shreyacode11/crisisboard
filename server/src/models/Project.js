import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Project name is required'], trim: true },
  description: { type: String, default: '' },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
  identifier: { type: String, uppercase: true, trim: true }
}, { timestamps: true })

projectSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.identifier = this.name.substring(0, 3).toUpperCase()
  }
})

const Project = mongoose.model('Project', projectSchema)
export default Project
