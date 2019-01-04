import { Router } from 'express'
const router = Router()

// Home Page
router.get('/', (req, res) => {
  res.send('<h1>Welcome</h1>')
})

export default router
