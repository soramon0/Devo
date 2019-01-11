import { Router } from 'express'
const router = Router()

// Home Page
router.get('/', (_req, res) => {
  res.json({ message: "Welcome to Devo's API Service" })
})

export default router
