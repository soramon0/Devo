import { sign } from 'jsonwebtoken'
import User from '../../../models/User'

// Load Input Validatoin
import { ensureRegister, ensureLogin } from '../../../validation'

const InvalidLogin = { login: 'Invalid login' }
const InvalidRegister = { login: 'Invalid register' }

// Handles register
export const register = async (req, res) => {
  // Validate Inputs
  const notValid = await ensureRegister(req.body)
  if (notValid) return res.status(400).json(notValid)

  // Check if user exists
  const { name, email, password } = req.body
  const user = await User.findOne({ email })
  if (user) return res.status(400).json(InvalidRegister)

  // Register User
  const newUser = await new User({ name, email, password }).save()
  res.json(newUser)
}

// Handles login
export const login = async (req, res) => {
  // Validate Inputs
  const notValid = await ensureLogin(req.body)
  if (notValid) return res.status(400).json(notValid)
  const { email, password } = req.body

  // Find user by Email
  const user = await User.findOne({ email })

  // Check for user
  if (!user) return res.status(400).json(InvalidLogin)

  // Check for password
  const valid = await user.comparePassword(password)
  if (!valid) return res.status(400).json(InvalidLogin)
  // User is Valid

  // Create token payload
  const payload = { id: user.id, name: user.name, avatar: user.avatar, email: user.email }

  // Sign Token
  sign(payload, process.env.secretOrKey, { expiresIn: 3600 * 3 }, (err, token) => {
    if (err) return err
    res.json({ success: true, token: `Bearer ${token}` })
  })
}

// Handles current user
export const current = async (req, res) => {
  res.json({ user: req.user })
}
