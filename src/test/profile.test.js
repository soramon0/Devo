// import mongoose from 'mongoose'
import axios from 'axios'
import mongoose from 'mongoose'
import { describe, it, after, before } from 'mocha'
import { expect } from 'chai'
import User from '../models/User'
import Profile from '../models/Profile'
import {
  userUrl,
  profileUrl,
  registerReq,
  loginReq,
  createProfileReq,
  email,
  name,
  password,
  company,
  handle,
  skills,
  status
} from './helpers'

let token

describe('Test Profile Controller', () => {
  it('Check if the profile collection is empty', async () => {
    const profiles = await Profile.find()
    if (!profiles) {
      expect(profiles).to.equal('undefiend')
    }
  })

  it('Return unauthorized if a user tries to get/create/update a profile without authorization token', async () => {
    const createProfileOptions = {
      url: profileUrl,
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: createProfileReq(handle, status, skills, company)
    }
    try {
      await axios(createProfileOptions)
    } catch ({ response: { status, data } }) {
      expect(status).to.equal(401)
      expect(data).to.equal('Unauthorized')
    }
    try {
      await axios.get(profileUrl)
    } catch ({ response: { status, data } }) {
      expect(status).to.equal(401)
      expect(data).to.equal('Unauthorized')
    }
  })

  it('Create a profile in the database through the API', async () => {
    const registerUserOptions = {
      url: `${userUrl}/register`,
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: registerReq(name, email, password, password)
    }

    await axios(registerUserOptions)

    const loginUserOptions = {
      url: `${userUrl}/login`,
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      data: loginReq(email, password)
    }

    const response = await axios(loginUserOptions)
    token = response.data.token
    const createProfileOptions = {
      url: profileUrl,
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: token
      },
      data: createProfileReq(handle, status, skills, company)
    }

    const { data } = await axios(createProfileOptions)
    expect(data).to.be.an('object')
  })
})

after(async () => {
  await User.findOneAndDelete({ email })
  await Profile.findOneAndDelete({ handle })
  await mongoose.connection.close()
})
