import { Router } from 'express'
import passport from 'passport'

// Load User Handles
import { register, login, current } from './handels/user'

const router = Router()

// @route   Get /api/users/register
// @desc    Registers a user
// access   Public
router.post('/register', register)

// @route   Get /api/users/login
// @desc    Logs in a user
// access   Public
router.post('/login', login)

// @route   Get /api/users/current
// @desc    Return current user
// access   Private
router.get('/current', passport.authenticate('jwt', { session: false }), current)

export default router
