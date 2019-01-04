import { Router } from 'express'
const router = Router()

// @route   Get /api/users
// @desc    Tests users route
// access   Public
router.get('/', (req, res) => {
  res.json({
    msg: 'Users works'
  })
})

export default router
