import { Router } from 'express'
const router = Router()

// @route   Get /api/users
// @desc    Tests users route
// access   Public
router.get('*', (_req, res) => {
  res.status(404).json({
    msg: 'Not Found'
  })
})

export default router
