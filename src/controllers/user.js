import { sign, verify } from 'jsonwebtoken'
import User from '../models/User'
import redis from '../utils/redis'

// Load Input Validatoin
import { ensureRegister, ensureLogin } from '../validation'
import { errorRespone } from '../validation/ErrorHelper'
import { removeField } from '../utils/removeField'
import { sendEmail } from '../utils/sendEmail'
// Handles register
export const register = async (req, res) => {
  try {
    // Validate Inputs
    const notValid = await ensureRegister(req.body)
    if (notValid) return res.status(400).json(notValid)
    // Check if user exists
    const { name, email, password } = req.body
    const user = await User.findOne({ email })
    if (user) return errorRespone('register', 'Invalid register', res, 400)

    // Register User
    const newUser = new User({ name, email, password })

    const payload = { id: newUser._id }
    // let userToken = ''
    sign(
      payload,
      process.env.secretOrKey,
      { expiresIn: '1 day' },
      async (err, token) => {
        if (err) return errorRespone(err.name, err.message, res, 500)
        const url = `${req.protocol}://${req.get('host')}${
          req.baseUrl
        }/confirm/${token}`
        try {
          await sendEmail(email, url)
          await redis.set(newUser._id, newUser._id, 'ex', 60 * 60 * 24)
        } catch (err) {
          return errorRespone(
            err.name,
            'Something went wrong please try again.',
            res,
            500
          )
        }
      }
    )

    // Save User
    await newUser.save()

    const registeredUser = removeField(newUser._doc, 'password')
    res.json(registeredUser)
  } catch (err) {
    return errorRespone(err.name, err.message, res, 400)
  }
}

export const confirmEmail = async (req, res) => {
  const { token } = req.params
  verify(token, process.env.secretOrKey, async (err, { id }) => {
    if (err) {
      return errorRespone(err.name, err.message, res, 500)
    }
    const userClickedOnce = await redis.get(id)
    if (userClickedOnce) {
      await redis.del(id)
      await User.findOneAndUpdate({ _id: id }, { isConfirmed: true })
      res.json({ success: true, message: 'Your email was verified' })
    } else {
      res.redirect('/')
    }
  })
}

// Handles login
export const login = async (req, res) => {
  try {
    // Validate Inputs
    const notValid = await ensureLogin(req.body)
    if (notValid) return res.status(400).json(notValid)
    const { email, password } = req.body

    // Find user by Email
    const user = await User.findOne({ email })

    // Check for user
    if (!user) return errorRespone('login', 'Invalid login', res, 400)

    // Check for password
    const valid = await user.comparePassword(password)
    if (!valid) return errorRespone('login', 'Invalid login', res, 400)
    // User is Valid

    // Check if User confirmed their Email
    if (!user.isConfirmed && process.env.NODE_ENV === 'production') {
      return errorRespone('login', 'Please confirm your email first', res, 400)
    }

    // Create token payload
    const payload = { id: user.id, name: user.name, avatar: user.avatar }

    // Sign Token
    sign(
      payload,
      process.env.secretOrKey,
      { expiresIn: 3600 * 3 },
      (err, token) => {
        if (err) return errorRespone(err.name, err.message, res, 500)
        res.json({ success: true, token: `Bearer ${token}` })
      }
    )
  } catch (err) {
    return errorRespone(err.name, err.message, res, 500)
  }
}

// Handles current user
export const current = async (req, res) => {
  res.json({ user: req.user })
}
