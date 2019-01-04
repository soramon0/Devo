import * as yup from 'yup'

const name = yup.string().required().min(3).max(30).trim().strict().label('Name')
const email = yup.string().required().email().label('Email')
const password = yup.string().required().min(8).max(255).label('Password')

export const ensureRegister = async data => {
  const schema = yup.object().shape({
    name,
    email,
    password,
    password2: yup.string().required().test('match', 'Passwords must match', function (password2) {
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
