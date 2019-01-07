import { Router } from 'express'
import { errorRespone } from '../validation/ErrorHelper'
const router = Router()

// @route   ALL Methods /*
// @desc    Return Error response
// access   Public
router.all('*', ({ method, url }, res) => {
  errorRespone('request', `the requested method ${method} on path ${url} is not handled`, res)
})

export default router
