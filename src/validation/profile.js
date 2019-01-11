import * as yup from 'yup'

import {
  handle,
  status,
  skills,
  company,
  website,
  youtube,
  facebook,
  twitter,
  linkedin,
  instagram,
  location,
  bio,
  githubusername,
  title,
  current,
  description,
  school,
  degree,
  fieldofstudy,
  from,
  to
} from './fields'

export const ensureProfile = async data => {
  const schema = yup.object().shape({
    handle,
    status,
    skills,
    company,
    website,
    youtube,
    facebook,
    twitter,
    linkedin,
    instagram,
    location,
    bio,
    githubusername
  })
  try {
    await schema.validate(data, { abortEarly: false })
  } catch (err) {
    return { name: err.name, error: err.errors }
  }
}

export const ensureProfileExp = async data => {
  const schema = yup.object().shape({
    title,
    location,
    current,
    description,
    from,
    to,
    company: yup
      .string()
      .required()
      .trim()
      .strict()
      .min(3)
      .max(40)
      .label('Company')
  })
  try {
    await schema.validate(data, { abortEarly: false })
  } catch (err) {
    return { name: err.name, error: err.errors }
  }
}

export const ensureProfileEdu = async data => {
  const schema = yup.object().shape({
    school,
    degree,
    fieldofstudy,
    description,
    current,
    from,
    to
  })
  try {
    await schema.validate(data, { abortEarly: false })
  } catch (err) {
    return { name: err.name, error: err.errors }
  }
}
