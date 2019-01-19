import mongoose from 'mongoose'
import axios from 'axios'
import { describe, it, after } from 'mocha'
import { expect } from 'chai'
import User from '../models/User'
import {
  userUrl,
  loginReq,
  registerReq,
  name,
  email,
  password
} from './helpers'

describe('Test User Controller', () => {
  it('Check if the users collection is empty', async () => {
    const users = await User.find()
    if (!users) {
      expect(users).to.equal('undefiend')
    }
  })

  it('Return error if json request is invalid', async () => {
    const registerOptions = {
      method: 'post',
      url: `${userUrl}/register`,
      headers: { 'content-type': 'application/json' },
      data: `{ name: "email" }`
    }
    try {
      await axios(registerOptions)
    } catch ({ response: { status, data } }) {
      expect(status).to.equal(400)
      expect(data).to.be.an('object')
      expect(data).to.have.own.property('error')
      expect(data).to.have.nested.property('error.SyntaxError')
      expect(data.error.SyntaxError).to.equal(
        'Unexpected token n in JSON at position 2'
      )
    }
  })

  it('Return an array of errors if registration inputs were empty', async () => {
    const registerOptions = {
      method: 'post',
      url: `${userUrl}/register`,
      headers: { 'content-type': 'application/json' },
      data: ''
    }
    try {
      await axios(registerOptions)
    } catch ({ response: { status, data } }) {
      expect(status).to.equal(400)
      expect(data).to.be.an('object')
      expect(data).to.have.own.property('name')
      expect(data.name).to.equal('ValidationError')
      expect(data).to.have.own.property('error')
      expect(data.error).to.be.an('array')
      expect(data.error).to.have.lengthOf(4)
      expect(data.error[0]).to.equal('Name is a required field')
      expect(data.error[1]).to.equal('Email is a required field')
      expect(data.error[2]).to.equal('password2 is a required field')
      expect(data.error[3]).to.equal('Password is a required field')
    }
  })

  it('Return an array of errors if registration inputs are invalid', async () => {
    const registerOptions = {
      method: 'post',
      url: `${userUrl}/register`,
      headers: { 'content-type': 'application/json' },
      data: registerReq('    kai', 'email', 'pass', password)
    }
    try {
      await axios(registerOptions)
    } catch ({ response: { status, data } }) {
      expect(status).to.equal(400)
      expect(data).to.be.an('object')
      expect(data).to.have.own.property('name')
      expect(data.name).to.equal('ValidationError')
      expect(data).to.have.own.property('error')
      expect(data.error).to.be.an('array')
      expect(data.error).to.have.lengthOf(4)
      expect(data.error[0]).to.equal('Name must be a trimmed string')
      expect(data.error[1]).to.equal('Email must be a valid email')
      expect(data.error[2]).to.equal('Passwords must match')
      expect(data.error[3]).to.equal('Password must be at least 8 characters')
    }
  })

  it('Register a user in the database through the API', async () => {
    const registerOptions = {
      method: 'post',
      url: `${userUrl}/register`,
      headers: { 'content-type': 'application/json' },
      data: registerReq(name, email, password, password)
    }
    const { data } = await axios(registerOptions)
    expect(data).to.be.an('object')
    expect(data).to.have.own.property('_id')
    expect(data).to.have.own.property('isConfirmed')
    expect(data.isConfirmed).to.equal(false)
    expect(data).to.have.own.property('avatar')
    expect(data).to.have.own.property('createdAt')
    expect(data).to.have.own.property('updatedAt')
    expect(data.name).to.equal(name)
    expect(data.email).to.equal(email)
    expect(data.password).to.not.equal(password)
    const user = await User.findOne({ email })
    expect(user.id).to.equal(data._id)
    expect(user.name).to.equal(data.name)
    expect(user.email).to.equal(data.email)
  })

  it('Dubplicate Emails', async () => {
    const registerOptions = {
      url: `${userUrl}/register`,
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: registerReq(name, email, password, password)
    }
    try {
      await axios(registerOptions)
    } catch ({ response: { status, data } }) {
      expect(status).to.equal(400)
      expect(data.error.register).to.equal('Invalid register')
    }
  })

  it('Return an array of errors if login inputs were empty', async () => {
    const loginOptions = {
      method: 'post',
      url: `${userUrl}/login`,
      headers: { 'content-type': 'application/json' },
      data: ''
    }
    try {
      await axios(loginOptions)
    } catch ({ response: { status, data } }) {
      expect(status).to.equal(400)
      expect(data).to.be.an('object')
      expect(data).to.have.own.property('name')
      expect(data.name).to.equal('ValidationError')
      expect(data).to.have.own.property('error')
      expect(data.error).to.be.an('array')
      expect(data.error).to.have.lengthOf(2)
      expect(data.error[0]).to.equal('Email is a required field')
      expect(data.error[1]).to.equal('Password is a required field')
    }
  })

  it('Return an array of errors if login inputs are invalid', async () => {
    const loginOptions = {
      method: 'post',
      url: `${userUrl}/login`,
      headers: { 'content-type': 'application/json' },
      data: loginReq('invalidEmail@gmail', '       ')
    }
    try {
      await axios(loginOptions)
    } catch ({ response: { status, data } }) {
      expect(status).to.equal(400)
      expect(data).to.be.an('object')
      expect(data).to.have.own.property('name')
      expect(data.name).to.equal('ValidationError')
      expect(data).to.have.own.property('error')
      expect(data.error).to.be.an('array')
      expect(data.error[0]).to.equal('Email must be a valid email')
      expect(data.error[1]).to.equal('Password must be at least 8 characters')
    }
  })

  it('Login with unregistered email return error', async () => {
    const registerOptions = {
      url: `${userUrl}/login`,
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: loginReq('asap@gmail.com', password)
    }
    try {
      await axios(registerOptions)
    } catch ({ response: { status, data } }) {
      expect(status).to.equal(400)
      expect(data.error.login).to.equal('Invalid login')
    }
  })

  it('Login with a incorrect password return error', async () => {
    const options = {
      url: `${userUrl}/login`,
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: loginReq(email, 'password')
    }
    try {
      await axios(options)
    } catch ({ response: { status, data } }) {
      expect(status).to.equal(400)
      expect(data.error.login).to.equal('Invalid login')
    }
  })

  it('Login a user and get user info with user token', async () => {
    const loginOptions = {
      url: `${userUrl}/login`,
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: loginReq(email, password)
    }
    const { data } = await axios(loginOptions)
    expect(data).to.be.an('object')
    expect(data).to.have.own.property('token')
    expect(data).to.have.own.property('success')
    expect(data.success).to.equal(true)
    expect(data.token).to.not.be.a('null')
    const logedInUserOptions = {
      url: `${userUrl}/current`,
      method: 'GET',
      headers: { authorization: data.token }
    }
    const res = await axios(logedInUserOptions)
    expect(res).to.have.nested.property('data.user')
    expect(res.data.user).to.be.an('object')
    expect(res.data).to.have.nested.property('user._id')
    expect(res.data).to.have.nested.property('user.avatar')
    expect(res.data).to.have.nested.property('user.createdAt')
    expect(res.data).to.have.nested.property('user.updatedAt')
    expect(res.data).to.not.have.nested.property('user.password')
    expect(res.data.user.name).to.equal(name)
    expect(res.data.user.email).to.equal(email)
  })
})

after(async () => {
  await User.findOneAndDelete({ email })
  await mongoose.connection.close()
})
