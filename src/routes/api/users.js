import { Router } from 'express'
import { authenticateWith } from '../../utils/authStrategy'

// Load User Handles
import { register, login, current } from '../../controllers/user'

const router = Router()

// @route   POST /api/user/register
// @desc    Registers a user
// access   Public
router.post('/register', register)

// @route   POST /api/user/confirm/:token
// @desc    Confirm user email
// access   Public
// router.get('/confirm/:token', confirmEmail)

// @route   POST /api/user/login
// @desc    Logs in a user
// access   Public
router.post('/login', login)

// @route   GET /api/user/current
// @desc    Return current user
// access   Private
router.get('/current', authenticateWith('jwt'), current)

export default router
