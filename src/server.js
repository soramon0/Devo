import 'dotenv/config'
import express from 'express'
import favicon from 'serve-favicon'
import helmet from 'helmet'
import featurePolicy from 'feature-policy'
import compression from 'compression'
import timeout from 'express-timeout-handler'
import ExpressBrute from 'express-brute'
import RedisStore from 'express-brute-redis'
import moment from 'moment'
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
import { errorRespone } from './validation/ErrorHelper'

// ENV Vars
const { DB_URI, DB_TEST, PORT, NODE_ENV } = process.env

const app = express()

// MiddleWare
app.use(
  helmet({
    referrerPolicy: { policy: 'same-origin' },
    contentSecurityPolicy: {
      directives: {
        blockAllMixedContent: true,
        defaultSrc: ["'self'"],
        styleSrc: ["'self'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'"],
        objectSrc: ["'none'"],
        fontSrc: ["'self'"],
        frameSrc: ["'self'"]
      },
      disableAndroid: true
    }
  })
)
app.use(
  featurePolicy({
    features: {
      fullscreen: ["'self'"],
      vibrate: ["'self'"],
      payment: ["'self'"],
      syncXhr: ["'none'"]
    }
  })
)

const store = new RedisStore({
  host: '127.0.0.1',
  port: 6379
})

const failCallback = (_req, res, _next, nextValidRequestDate) => {
  errorRespone(
    'Rate limit',
    `You've made too many failed attempts in a short period of time, please try again later in ${moment(
      nextValidRequestDate
    ).fromNow()}`,
    res,
    429
  )
}
const handleStoreError = error => {
  console.error(error)
  throw new Error({
    message: error.message,
    parent: error.parent
  })
}
const bruteforce = new ExpressBrute(store, {
  freeRetries: 1000,
  attachResetToRequest: false,
  refreshTimeoutOnRequest: false,
  minWait: 5 * 60 * 1000, // 5 minutes
  maxWait: 60 * 60 * 1000, // 1 hour,
  failCallback,
  handleStoreError,
  lifetime: 24 * 60 * 60
})

app.set('trust proxy', 1)

app.use(
  timeout.handler({
    timeout: 5000,
    onTimeout: (_req, res) => {
      return errorRespone(
        'Service timedout',
        'Service unavailable. Please retry',
        res,
        503
      )
    }
  })
)
app.use(favicon(join(__dirname, 'public', 'img', 'favicon.png')))
app.use(json())
app.use(compression())
// Passport MiddlewARE
app.use(passport.initialize())
passportConfig()

// Development MiddleWare
if (NODE_ENV === 'development') {
  app.use(volleyball)
}

// Connect to Database
const db = process.env.NODE_ENV === 'test' ? DB_TEST : DB_URI
connect(
  db,
  { useNewUrlParser: true }
)
  .then(() => {
    console.log('- Database Connected...')
    const port = PORT || 3000
    app.listen(port, () =>
      console.log(`- Server Started On http://localhost:${port}`)
    )

    // Routes
    app.use('/', bruteforce.prevent, index)
    app.use('/api/user', users)
    app.use('/api/profile', profile)
    app.use('/api/post', posts)
    app.use(notFound)
    app.use((err, _req, res, next) => {
      if (err.status === 400) return errorRespone(err.name, err.message, res)
      return next(err)
    })
  })
  .catch(err => {
    const error = {
      name: err.name,
      message: err.message || err.msg
    }
    console.error(error)
    return error
  })
