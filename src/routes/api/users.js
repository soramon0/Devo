import { Router } from 'express'
import passport from 'passport'

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
router.get('/current', passport.authenticate('jwt', { session: false }), current)

export default router
