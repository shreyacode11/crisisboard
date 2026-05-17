import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'


const userSchema = new mongoose.Schema({
  isVerified: { type: Boolean, default: false },
verifyToken: { type: String },
verifyTokenExpiry: { type: Date },
// models/User.js — add these fields
isOnline: { type: Boolean, default: false },
lastSeen: { type: Date, default: Date.now },

  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  avatar: {
    type: String,
    default: '',
  },
  refreshToken: {
    type: String,
    select: false,
  },
}, { timestamps: true })



// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}


const User = mongoose.model('User', userSchema)
export default User