import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import User from '../models/User'
import { removeField } from '../utils/removeField'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.secretOrKey
}

export default () => {
  passport.use(
    new Strategy(opts, async ({ id }, done) => {
      const user = await User.findById(id)
      if (user) {
        // Remove password from req.user
        const currentUser = removeField(user._doc, 'password')
        return done(null, currentUser)
      }
      return done(null, false)
    })
  )
}
