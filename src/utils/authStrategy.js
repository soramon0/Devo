import passport from 'passport'

export const authenticateWith = strategy => passport.authenticate(strategy, { session: false })