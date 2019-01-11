import { Router } from 'express'
import { authenticateWith } from '../../utils/authStrategy'
import {
  addPost,
  getPostById,
  getAllPosts,
  delPost,
  likePost,
  unlikePost,
  addPostComment,
  delPostComment
} from '../../controllers/post'
const router = Router()

// @route   GET /api/post/all
// @desc    Create A Post
// access   Public
router.get('/all', getAllPosts)

// @route   GET /api/post/:postId
// @desc    Gets a post by id
// access   Public
router.get('/:postId', getPostById)

// @route   POST /api/posts
// @desc    Create A Post
// access   Private
router.post('/', authenticateWith('jwt'), addPost)

// @route   DELETE /api/post/:postId
// @desc    Delete A Post
// access   Private
router.delete('/:postId', authenticateWith('jwt'), delPost)

// @route   POST /api/post/like/:id
// @desc    Adde A Like To A Post
// access   Private
router.post('/like/:postId', authenticateWith('jwt'), likePost)

// @route   POST /api/post/like/:id
// @desc    Remove A Like from Post
// access   Private
router.delete('/like/:postId', authenticateWith('jwt'), unlikePost)

// @route   POST /api/post/comment/:id
// @desc    Add a comment to a post
// access   Private
router.post('/comment/:postId', authenticateWith('jwt'), addPostComment)

// @route   POST /api/post/comment/:postId/:commentId
// @desc    Removes a comment from post
// access   Private
router.delete(
  '/comment/:postId/:commentId',
  authenticateWith('jwt'),
  delPostComment
)

export default router
