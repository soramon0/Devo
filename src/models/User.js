import { Schema, model } from 'mongoose'
import { hash, compare } from 'bcryptjs'
import { url } from 'gravatar'

import { user } from './schema'

const userSchema = new Schema(user, { timestamps: true })

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

const User = model('User', userSchema)

export default User
