import { Router } from 'express'
import { authenticateWith } from '../../utils/authStrategy'

// Load User Handles
import { register, login, current } from './handles/user'

const router = Router()

// @route   POST /api/users/register
// @desc    Registers a user
// access   Public
router.post('/register', register)

// @route   POST /api/users/login
// @desc    Logs in a user
// access   Public
router.post('/login', login)

// @route   GET /api/users/current
// @desc    Return current user
// access   Private
router.get('/current', authenticateWith('jwt'), current)

export default router
