import 'dotenv/config'
import '@babel/polyfill'
import mongoose from 'mongoose'
import { before, it, after, describe } from 'mocha'
import { expect } from 'chai'
import User from '../models/User'
// let User
let db

let name = 'kai desu'
let email = 'kai@gmail.com'
let password = 'kai12345'

before('Connect to test database', () => {
  db = mongoose.connection.openUri('mongodb://localhost:27017/devconnectorTest', { useNewUrlParser: true })
  db.on('error', console.error.bind(console, 'connection error'))
})

describe('Test User Controller', () => {
  it('Check if the users collection is empty', async () => {
    const users = await User.find()
    if (!users) {
      expect(users).equal('undefiend')
    }
  })

  it('Create a new user', async () => {
    const user = new User({ name, email, password })
    const savedUser = await user.save()
    expect(savedUser.name).equal(name)
    expect(savedUser.email).equal(email)
    expect(savedUser.password).to.not.equal(password)
  })
})

after(done => {
  db.dropDatabase(done => {
    mongoose.connection.close(done)
  })
  done()
})
