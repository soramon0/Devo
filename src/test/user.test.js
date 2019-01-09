import 'dotenv/config'
import '../server'
import mongoose from 'mongoose'
import request from 'request-promise'
import { expect } from 'chai'
import User from '../models/User'

let name = 'kai desu'
let email = 'kai@gmail.com'
let password = 'kai12345'
let url = `http://localhost:${process.env.PORT}/api/users`
let registerReq = `
  {
    "name": "${name}",
    "email": "${email}",
    "password": "${password}",
    "password2": "${password}"
  }
`
let loginReq = (e, p) =>`
  {
    "email": "${e}",
    "password": "${p}"
  }
`

describe('Test User Controller', () => {
  it('Check if the users collection is empty', async () => {
    const users = await User.find()
    if (!users) {
      expect(users).to.equal('undefiend')
    }
  })

  it('Register a user in the database through the API', async () => {
    const options = { uri: `${url}/register`, method: 'POST', headers: { 'content-type': 'application/json' }, body: registerReq }
    let response = await request(options)
    response = JSON.parse(response)
    expect(response).to.be.an('object')
    expect(response).to.have.own.property('_id')
    expect(response).to.have.own.property('avatar')
    expect(response).to.have.own.property('createdAt')
    expect(response).to.have.own.property('updatedAt')
    expect(response.name).to.equal(name)
    expect(response.email).to.equal(email)
    expect(response.password).to.not.equal(password)
    const user = await User.findOne({ email })
    expect(user.id).to.equal(response._id)
    expect(user.name).to.equal(response.name)
    expect(user.email).to.equal(response.email)
  })

  it('Dubplicate Emails', async () => {
    const options = { uri: `${url}/register`, method: 'POST', headers: { 'content-type': 'application/json' }, body: registerReq }
    try {
      await request(options)
    } catch ({ response: { body }, statusCode }) {
      const res = JSON.parse(body)
      expect(res.error.register).to.equal('Invalid register')
      expect(statusCode).to.equal(400)
    }
  })

  it('Login with bad email return error', async () => {
    const options = { uri: `${url}/login`, method: 'POST', headers: { 'content-type': 'application/json' }, body: loginReq('asap@gmail.com', password) }
    try {
      await request(options)
    } catch ({ response: { body }, statusCode }) {
      const res = JSON.parse(body)
      expect(res.error.login).to.equal('Invalid login')
      expect(statusCode).to.equal(400)
    }
  })

  it('Login with a bad password return error', async () => {
    const options = { uri: `${url}/login`, method: 'POST', headers: { 'content-type': 'application/json' }, body: loginReq(email, 'password') }
    try {
      await request(options)
    } catch ({ response: { body }, statusCode }) {
      const res = JSON.parse(body)
      expect(res.error.login).to.equal('Invalid login')
      expect(statusCode).to.equal(400)
    }
  })

  it('Login a user and get user info with user token', async () => {
    const options = { uri: `${url}/login`, method: 'POST', headers: { 'content-type': 'application/json' }, body: loginReq(email, password) }
    let response = await request(options)
    response = JSON.parse(response)
    expect(response).to.be.an('object')
    expect(response).to.have.own.property('token')
    expect(response).to.have.own.property('success')
    expect(response.success).to.equal(true)
    expect(response.token).to.not.be.a('null')
    const options2 = { uri: `${url}/current`, method: 'GET', headers: { 'authorization': response.token } }
    let response2 = await request(options2)
    expect(response2).to.be.an('string')
    response2 = JSON.parse(response2)
    expect(response2).to.be.an('object')
    expect(response2.user).to.be.an('object')
    expect(response2).to.have.nested.property('user._id')
    expect(response2).to.have.nested.property('user.avatar')
    expect(response2).to.have.nested.property('user.createdAt')
    expect(response2).to.have.nested.property('user.updatedAt')
    expect(response2).to.not.have.nested.property('user.password')
    expect(response2.user.name).to.equal(name)
    expect(response2.user.email).to.equal(email)
  })
})

after(done => {
  mongoose.connection.dropDatabase(done => {
    mongoose.connection.close(done)
  })
  done()
})
