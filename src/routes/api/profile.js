import { Router } from 'express'
import passport from 'passport'

// Load User Handles
import {
  getCurrentProfile,
  createProfile,
  getByHandle,
  getById,
  getAll,
  addExperience,
  addEducation,
  delExperience,
  delEducation,
  delProfileAndUser
} from './handles/profile'

const router = Router()

// @route   GET /api/profile
// @desc    Get current profile
// access   Private
router.get('/', passport.authenticate('jwt', { session: false }), getCurrentProfile)

// @route   GET /api/profile/all
// @desc    Gets an array of profiles
// access   Public
router.get('/all', getAll)

// @route   GET /api/profile/handle/:handle
// @desc    Get Profile by handle
// access   Public
router.get('/handle/:handle', getByHandle)

// @route   GET /api/profile/handle/:id
// @desc    Get Profile by ID
// access   Public
router.get('/user/:user_id', getById)

// @route   POST /api/profile
// @desc    Create or Edit user profile
// access   Private
router.post('/', passport.authenticate('jwt', { session: false }), createProfile)

// @route   POST /api/profile/experience
// @desc    Add experience
// access   Private
router.post('/experience', passport.authenticate('jwt', { session: false }), addExperience)

// @route   DELETE /api/profile/experience/:exp_id
// @desc    Deletes experience
// access   Private
router.delete('/experience/:exp_id', passport.authenticate('jwt', { session: false }), delExperience)

// @route   POST /api/profile/eduction
// @desc    Add education
// access   Private
router.post('/education', passport.authenticate('jwt', { session: false }), addEducation)

// @route   DELETE /api/profile/experience/:edu_id
// @desc    Deletes education
// access   Private
router.delete('/education/:edu_id', passport.authenticate('jwt', { session: false }), delEducation)

// @route   DELETE /api/profile
// @desc    Deletes education
// access   Private
router.delete('/', passport.authenticate('jwt', { session: false }), delProfileAndUser)

export default router
