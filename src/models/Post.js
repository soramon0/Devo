import { Schema, model } from 'mongoose'
import { post } from './schema'

const postSchema = new Schema(post, { timestamps: true })

postSchema.pre('findOne', function () {
  this.populate('user', 'name')
})

const Post = model('Post', postSchema)

export default Post
