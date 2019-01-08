import mongoose from 'mongoose'
import { before, it, after, describe } from 'mocha'
import { expect } from 'chai'
import { user } from '../models/schema'
let User
let db

before('Connect to test database', () => {
  db = mongoose.connection.useDb(process.env.DB_TEST)
  db.on('error', console.error.bind(console, 'connection error'))
  db.once('open', () => {
    console.log('We are connected to test database!')
  })
  User = db.model('User', user)
})

describe('Test User Controller', () => {
  it('Check if the users collection is empty', () => {
    User.find()
      .then(users => {
        if (!users) {
          expect(users).toEqual('undefiend')
        }
      })
  })
})

after(done => {
  db.dropDatabase(done => {
    mongoose.connection.close(done)
  })
  done()
})
