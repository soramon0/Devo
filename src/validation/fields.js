import * as yup from 'yup'

const minPassword = 8
const maxPassword = 255
const minDate = '1975-01-01'
const maxDate = new Date()
const minLength = 3
const maxLength = 40
const minTextLength = 10
const maxTextLength = 400

export const avatar = yup
  .string()
  .url()
  .label('Avatar')
export const text = yup
  .string()
  .required()
  .min(minTextLength)
  .max(maxTextLength)
  .trim()
  .strict()
  .label('Text')
export const name = yup
  .string()
  .required()
  .min(minLength)
  .max(maxLength)
  .trim()
  .strict()
  .label('Name')
export const email = yup
  .string()
  .required()
  .email()
  .label('Email')
export const password = yup
  .string()
  .required()
  .min(minPassword)
  .max(maxPassword)
  .label('Password')
export const handle = yup
  .string()
  .required()
  .min(minLength)
  .max(maxLength)
  .trim()
  .strict()
  .label('Handle')
export const status = yup
  .string()
  .required()
  .min(minLength)
  .max(maxLength)
  .trim()
  .strict()
  .label('Status')
export const skills = yup
  .string()
  .required()
  .trim()
  .strict()
  .label('Skills')
export const company = yup
  .string()
  .min(minLength)
  .max(maxLength)
  .trim()
  .strict()
  .label('Company')
export const website = yup
  .string()
  .url()
  .min(minLength)
  .max(maxLength)
  .label('Website')
export const youtube = yup
  .string()
  .url()
  .min(minLength)
  .max(maxLength)
  .label('Youtube')
export const facebook = yup
  .string()
  .url()
  .min(minLength)
  .max(maxLength)
  .label('Facebook')
export const twitter = yup
  .string()
  .url()
  .min(minLength)
  .max(maxLength)
  .label('Twitter')
export const linkedin = yup
  .string()
  .url()
  .min(minLength)
  .max(maxLength)
  .label('Linkedin')
export const instagram = yup
  .string()
  .url()
  .min(minLength)
  .max(maxLength)
  .label('Instagram')
export const location = yup
  .string()
  .min(minLength)
  .max(maxLength)
  .trim()
  .strict()
  .label('Location')
export const bio = yup
  .string()
  .min(minTextLength)
  .max(maxTextLength)
  .trim()
  .strict()
  .label('Bio')
export const githubusername = yup
  .string()
  .max(maxLength)
  .trim()
  .label('Github Username')
export const title = yup
  .string()
  .required()
  .min(minLength)
  .max(maxLength)
  .trim()
  .strict()
  .label('Title')
export const current = yup.bool().label('Current')
export const description = yup
  .string()
  .min(minTextLength)
  .max(maxTextLength)
  .trim()
  .strict()
  .label('Description')
export const school = yup
  .string()
  .required()
  .min(minLength)
  .max(maxLength)
  .trim()
  .strict()
  .label('School')
export const degree = yup
  .string()
  .required()
  .min(minLength)
  .max(maxLength)
  .trim()
  .strict()
  .label('Degree')
export const fieldofstudy = yup
  .string()
  .required()
  .min(minLength)
  .max(maxLength)
  .trim()
  .strict()
  .label('Field of Study')
export const from = yup
  .date()
  .required()
  .min(new Date(minDate))
  .max(maxDate)
  .label('From')
export const to = yup
  .date()
  .min(new Date(minDate))
  .label('To')
  .test('To check', 'To can not be less or equal to From', function (to) {
    const { from } = this.parent
    return to > from
  })
