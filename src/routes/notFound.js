import { Router } from 'express'
import { errorRespone } from '../validation/ErrorHelper';
const router = Router()

// @route   Get /api/users
// @desc    Tests users route
// access   Public
router.get('*', (_req, res) => {
  return errorRespone('path error', 'The given path is not allowed', res)
})

export default router
