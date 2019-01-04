import passport from 'passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import User from '../models/User'

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.secretOrKey
}

export default () => {
  passport.use(new Strategy(opts, async ({ id }, done) => {
    const user = await User.findById(id)
    if (user) {
      // Remove password from req.user
      const currentUser = Object.keys(user._doc).reduce((object, key) => {
        if (key !== 'password') {
          object[key] = user[key]
        }
        return object
      }, {})
      return done(null, currentUser)
    }
    return done(null, false)
  }))
}
