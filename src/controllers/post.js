import Post from '../models/Post'
import { errorRespone } from '../validation/ErrorHelper'
import { ensurePost, ensureComment } from '../validation'

export const getPostById = async ({ params: { postId } }, res) => {
  // Check if user_id is a valid Object ID
  if (!postId.match(/^[a-fA-F0-9]{24}$/)) {
    return errorRespone('invalid id', 'The provided id is not a valid one', res)
  }
  try {
    const post = await Post.findById(postId)
    if (!post) { return errorRespone('no post', 'There is no post with that id', res) }
    res.json(post)
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

export const getAllPosts = async (_req, res) => {
  try {
    const posts = await Post.find()
      .limit(6)
      .sort({ createdAt: -1 })
    if (posts.length < 1) { return errorRespone('no posts', 'There are no posts', res) }
    res.json(posts)
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

export const addPost = async (req, res) => {
  const notValid = await ensurePost(req.body)
  if (notValid) return res.status(400).json(notValid)
  try {
    const post = await new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.user.avatar,
      user: req.user._id
    }).save()
    res.json(post)
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

export const delPost = async ({ params: { postId }, user }, res) => {
  // Check if user_id is a valid Object ID
  if (!postId.match(/^[a-fA-F0-9]{24}$/)) {
    return errorRespone('invalid id', 'The provided id is not a valid one', res)
  }
  try {
    const post = await Post.findById(postId)
    if (!post) { return errorRespone('no post', 'There is no post with that id', res) }
    // Check if the loged in user_id is equal to the post id
    if (post.user.toString() !== user._id.toString()) {
      return errorRespone('not authorized', 'User not authorized', res, 401)
    }
    const deletedPost = await Post.findOneAndDelete({ _id: postId })
    res.json({ success: true, deletedPost })
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

export const likePost = async ({ params: { postId }, user }, res) => {
  // Check if postId is a valid Object ID
  if (!postId.match(/^[a-fA-F0-9]{24}$/)) {
    return errorRespone('invalid id', 'The provided id is not a valid one', res)
  }
  try {
    const post = await Post.findById(postId)
    if (!post) { return errorRespone('no post', 'There is no post with that id', res) }
    // Check if user already liked the post
    if (
      post.likes.filter(like => like.user.toString() === user._id.toString())
        .length > 0
    ) {
      return errorRespone(
        'already liked',
        'User already liked this post',
        res,
        400
      )
    }
    // Add user id to likes array
    post.likes.unshift({ user: user._id })
    const likedPost = await post.save()
    res.json(likedPost)
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

export const unlikePost = async ({ params: { postId }, user }, res) => {
  // Check if postId is a valid Object ID
  if (!postId.match(/^[a-fA-F0-9]{24}$/)) {
    return errorRespone('invalid id', 'The provided id is not a valid one', res)
  }
  try {
    const post = await Post.findById(postId)
    if (!post) { return errorRespone('no post', 'There is no post with that id', res) }
    post.likes.find(async (like, index) => {
      if (like.user.toString() === user._id.toString()) {
        post.likes.splice(index, 1)
        const unlikedPost = await post.save()
        res.json(unlikedPost)
      } else {
        return errorRespone(
          'not liked',
          'You have not yet liked this post',
          res,
          400
        )
      }
    })
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

export const addPostComment = async (
  { params: { postId }, body, user },
  res
) => {
  // Check if post id is a valid Object ID
  if (!postId.match(/^[a-fA-F0-9]{24}$/)) {
    return errorRespone('invalid id', 'The provided id is not a valid one', res)
  }
  const notValid = await ensureComment(body)
  if (notValid) return res.status(400).json(notValid)
  try {
    const post = await Post.findOne({ _id: postId })
    if (!post) { return errorRespone('no post', 'There is no post with that id', res) }
    const comment = {
      text: body.text,
      name: post.user.name,
      avatar: post.avatar,
      user: user._id
    }
    post.comments.unshift(comment)
    await post.save()
    res.json(post)
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

export const delPostComment = async (
  { params: { postId, commentId }, user },
  res
) => {
  // Check if user_id is a valid Object ID
  if (
    !postId.match(/^[a-fA-F0-9]{24}$/) ||
    !commentId.match(/^[a-fA-F0-9]{24}$/)
  ) {
    return errorRespone('invalid id', 'The provided id is not a valid one', res)
  }
  try {
    const post = await Post.findById(postId)
    if (!post) { return errorRespone('no post', 'There is no post with that id', res) }
    post.comments.find(async (comment, index) => {
      if (comment.user.toString() === user._id.toString()) {
        if (comment._id.toString() === commentId) {
          post.comments.splice(index, 1)
          await post.save()
          res.json(post)
        } else {
          return errorRespone(
            'unauthorized',
            'You are not authorized to delete this comment',
            res,
            400
          )
        }
      } else {
        return errorRespone(
          'no comment',
          'You have not yet commented on this post',
          res,
          400
        )
      }
    })
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}
