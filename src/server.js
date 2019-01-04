import express from 'express'
import favicon from 'serve-favicon'
import { json } from 'body-parser'
import { connect } from 'mongoose'
import passport from 'passport'
import passportConfig from './config/passport'
import { join } from 'path'

// Development packages
import volleyball from 'volleyball'

// Load Routes
import index from './routes'
import notFound from './routes/notFound'
import { users, profile, posts } from './routes/api'

// ENV Vars
const { DB_URI, PORT, NODE_ENV } = process.env

const app = express()

// MiddleWare
app.use(favicon(join(__dirname, 'public', 'img', 'favicon.png')))
app.use(json())
// Passport MiddlewARE
app.use(passport.initialize())
passportConfig()

// Development MiddleWare
if (NODE_ENV === 'development') {
  app.use(volleyball)
}

// Connect to Database
connect(DB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('- Database Connected...')
    const port = PORT || 3000
    app.listen(port, () => console.log(`- Server Started On http://localhost:${port}`))

    // Routes
    app.use('/', index)
    app.use('/api/users', users)
    app.use('/api/profile', profile)
    app.use('/api/posts', posts)
    app.use(notFound)
  })
  .catch(err => {
    throw new Error({
      name: err.name,
      message: err.message || err.msg
    })
  })
