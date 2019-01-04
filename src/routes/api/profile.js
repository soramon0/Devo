import { Router } from 'express'
const router = Router()

// @route   Get /api/profile
// @desc    Tests profile route
// access   Public
router.get('/', (req, res) => {
  res.json({
    msg: 'Profile works'
  })
})

export default router
