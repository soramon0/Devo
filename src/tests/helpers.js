import faker from 'faker'
const { APP_PORT } = process.env

export const name = faker.name.findName().toLowerCase()
export const email = faker.internet.email().toLowerCase()
export const password = faker.internet.password()
export const handle = faker.internet.userName().toLowerCase()
export const company = faker.company.companyName().toLowerCase()
export const status = 'developer'
export const skills = 'html,css,js,node'

export const profileUrl = `http://localhost:${APP_PORT}/api/profile`
export const userUrl = `http://localhost:${APP_PORT}/api/user`
export const postUrl = `http://localhost:${APP_PORT}/api/post`

export const registerReq = (n, e, p, p2) => `
  {
    "name": "${n}",
    "email": "${e}",
    "password": "${p}",
    "password2": "${p2}"
  }
`

export const loginReq = (e, p) => `
  {
    "email": "${e}",
    "password": "${p}"
  }
`
export const createProfileReq = (handle, status, skills, company) => `
  {
    "handle": "${handle}",
    "status": "${status}",
    "skills": "${skills}",
    "company": "${company}"
  }
`
