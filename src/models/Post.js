import { Schema, model } from 'mongoose'
import { post } from './schema'

const postSchema = new Schema(post, { timestamps: true })

const Post = model('Post', postSchema)

export default Post
