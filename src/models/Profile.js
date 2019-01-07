import { Schema, model } from 'mongoose'

import { profile } from './schema'

const profileSchema = new Schema(profile, { timestamps: true })

profileSchema.pre('findOne', function () {
  this.populate('user', ['name', 'avatar'])
})

profileSchema.pre('find', function () {
  this.populate('user', ['name', 'avatar'])
})

const Profile = model('Profile', profileSchema)

export default Profile
