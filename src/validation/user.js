import * as yup from 'yup'

import { name, email, password } from './fields'

export const ensureRegister = async data => {
  const schema = yup.object().shape({
    name,
    email,
    password,
    password2: yup
      .string()
      .required()
      .test('match', 'Passwords must match', function (password2) {
        const { password } = this.parent
        return password === password2
      })
  })
  try {
    await schema.validate(data, { abortEarly: false })
  } catch (err) {
    return { name: err.name, error: err.errors }
  }
}

export const ensureLogin = async data => {
  const schema = yup.object().shape({ email, password })
  try {
    await schema.validate(data, { abortEarly: false })
  } catch (err) {
    return { name: err.name, error: err.errors }
  }
}
