import { sign } from 'jsonwebtoken'
import User from '../../../models/User'

// Load Input Validatoin
import { ensureRegister, ensureLogin } from '../../../validation'
import { errorRespone } from '../../../validation/ErrorHelper'
import { removeField } from '../../../utils/removeField'

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
    const newUser = await new User({ name, email, password }).save()
    const registeredUser = removeField(newUser._doc, 'password')
    res.json(registeredUser)
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
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

    // Create token payload
    const payload = { id: user.id, name: user.name, avatar: user.avatar }

    // Sign Token
    sign(payload, process.env.secretOrKey, { expiresIn: 3600 * 3 }, (err, token) => {
      if (err) errorRespone(err.name, err.message, res, 500)
      res.json({ success: true, token: `Bearer ${token}` })
    })
  } catch (err) {
    return errorRespone(err.name, err.message, res, 500)
  }
}

// Handles current user
export const current = async (req, res) => {
  res.json({ user: req.user })
}
