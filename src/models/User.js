import { Schema, model } from 'mongoose'
import { hash, compare } from 'bcryptjs'
import { url } from 'gravatar'

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true })

userSchema.pre('save', async function () {
  if (this.isModified('password')) {
    try {
      // Hash Password
      this.password = await hash(this.password, 10)
      // Create Avatar
      this.avatar = url(this.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      })
    } catch (ex) {
      return {
        name: ex.name,
        message: ex.message
      }
    }
  }
})

userSchema.methods.comparePassword = async function (InputPassword) {
  const valid = await compare(InputPassword, this.password)
  return valid
}

const User = model('user', userSchema)

export default User
