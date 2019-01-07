import * as yup from 'yup'

import { name, text, avatar } from './fields'

export const ensurePost = async data => {
  const schema = yup.object().shape({ name, text, avatar })
  try {
    await schema.validate(data, { abortEarly: false })
  } catch (err) {
    return { name: err.name, error: err.errors }
  }
}
