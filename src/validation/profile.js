import * as yup from 'yup'

const minDate = '1975-01-01'
const maxDate = new Date()

const handle = yup.string().required().min(3).max(40).trim().strict().label('Handle')
const status = yup.string().required().min(3).max(40).trim().strict().label('Status')
const skills = yup.string().required().trim().strict().label('Skills')
const company = yup.string().min(3).max(40).trim().strict().label('Company')
const website = yup.string().url().min(3).max(40).label('Website')
const youtube = yup.string().url().min(3).max(40).label('Youtube')
const facebook = yup.string().url().min(3).max(40).label('Facebook')
const twitter = yup.string().url().min(3).max(40).label('Twitter')
const linkedin = yup.string().url().min(3).max(40).label('Linkedin')
const instagram = yup.string().url().min(3).max(40).label('Instagram')
const location = yup.string().min(3).max(40).trim().strict().label('Location')
const bio = yup.string().min(10).max(400).trim().strict().label('Bio')
const githubusername = yup.string().max(40).trim().label('Github Username')
const title = yup.string().required().min(3).max(40).trim().strict().label('Title')
const current = yup.bool().label('Current')
const description = yup.string().min(10).max(400).trim().strict().label('Description')
const school = yup.string().required().min(3).max(40).trim().strict().label('School')
const degree = yup.string().required().min(3).max(40).trim().strict().label('Degree')
const fieldofstudy = yup.string().required().min(3).max(40).trim().strict().label('Field of Study')
const from = yup.date().required().min(new Date(minDate)).max(maxDate).label('From')
const to = yup.date().min(new Date(minDate)).label('To')
  .test('To check', 'To can not be less or equal than From', function (to) {
    const { from } = this.parent
    return to > from
  })

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
    company: yup.string().required().trim().strict().min(3).max(40).label('Company')
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
