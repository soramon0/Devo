import { Router } from 'express'
const router = Router()

// Home Page
router.get('/', (_req, res) => {
  res.send('<h1>Welcome</h1>')
})

export default router
