import { Router } from 'express'
const router = Router()

// @route   Get /api/posts
// @desc    Tests posts route
// access   Public
router.get('/', (req, res) => {
  res.json({
    msg: 'Posts works'
  })
})

export default router
