import mongoose from 'mongoose'

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['admin', 'member', 'viewer'], default: 'member' }
}, { _id: false })

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Workspace name is required'], trim: true },
  description: { type: String, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [memberSchema],
  joinRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  slug: { type: String, unique: true, lowercase: true, trim: true }
}, { timestamps: true })

workspaceSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
  }
})

const Workspace = mongoose.model('Workspace', workspaceSchema)
export default Workspace
