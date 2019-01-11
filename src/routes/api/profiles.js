import { Router } from 'express'
import { authenticateWith } from '../../utils/authStrategy'

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
} from '../../controllers/profile'

const router = Router()

// @route   GET /api/profile
// @desc    Get current profile
// access   Private
router.get('/', authenticateWith('jwt'), getCurrentProfile)

// @route   GET /api/profile/all
// @desc    Gets an array of profiles
// access   Public
router.get('/all', getAll)

// @route   GET /api/profile/handle/:handle
// @desc    Get Profile by handle
// access   Public
router.get('/handle/:handle', getByHandle)

// @route   GET /api/profile/user/:userId
// @desc    Get Profile by userId
// access   Public
router.get('/user/:userId', getById)

// @route   POST /api/profile
// @desc    Create or Edit user profile
// access   Private
router.post('/', authenticateWith('jwt'), createProfile)

// @route   POST /api/profile/experience
// @desc    Add experience
// access   Private
router.post('/experience', authenticateWith('jwt'), addExperience)

// @route   DELETE /api/profile/experience/:exp_id
// @desc    Deletes experience
// access   Private
router.delete('/experience/:expId', authenticateWith('jwt'), delExperience)

// @route   POST /api/profile/eduction
// @desc    Add education
// access   Private
router.post('/education', authenticateWith('jwt'), addEducation)

// @route   DELETE /api/profile/experience/:edu_id
// @desc    Deletes education
// access   Private
router.delete('/education/:eduId', authenticateWith('jwt'), delEducation)

// @route   DELETE /api/profile
// @desc    Deletes education
// access   Private
router.delete('/', authenticateWith('jwt'), delProfileAndUser)

export default router
