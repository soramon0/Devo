import { Router } from 'express'
import { authenticateWith } from '../../utils/authStrategy'
import { addPost, getPostById, getAllPosts, delPost, likePost, unlikePost, addPostComment, delPostComment } from './handles/post'
const router = Router()

// @route   GET /api/posts/all
// @desc    Create A Post
// access   Public
router.get('/all', getAllPosts)

// @route   GET /api/posts/post/:post_id
// @desc    Gets a post by id
// access   Public
router.get('/post/:post_id', getPostById)

// @route   POST /api/posts
// @desc    Create A Post
// access   Private
router.post('/', authenticateWith('jwt'), addPost)

// @route   DELETE /api/posts/post/:post_id
// @desc    Delete A Post
// access   Private
router.delete('/post/:post_id', authenticateWith('jwt'), delPost)

// @route   POST /api/posts/like/:id
// @desc    Adde A Like To A Post
// access   Private
router.post('/like/:id', authenticateWith('jwt'), likePost)

// @route   POST /api/posts/unlike/:id
// @desc    Remove A Like from Post
// access   Private
router.delete('/like/:id', authenticateWith('jwt'), unlikePost)

// @route   POST /api/posts/comment/:id
// @desc    Add a comment to a post
// access   Private
router.post('/comment/:id', authenticateWith('jwt'), addPostComment)

// @route   POST /api/posts/comment/:id
// @desc    Removes a comment from post
// access   Private
router.delete('/comment/:id/:comment_id', authenticateWith('jwt'), delPostComment)

export default router
