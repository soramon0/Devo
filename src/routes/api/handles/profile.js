import Profile from '../../../models/Profile'
import User from '../../../models/User'

import { ensureProfile, ensureProfileExp, ensureProfileEdu } from '../../../validation'
import { errorRespone } from '../../../validation/ErrorHelper'
import { GetProfileFields } from '../../../utils/profile'

// Gets Current Profile
export const getCurrentProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id })
    if (!profile) return errorRespone('no profile', 'There is no profile for this user', res)
    res.json(profile)
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

// Gets Current Profile
export const getAll = async (_req, res) => {
  try {
    const profiles = await Profile.find().limit(6)
    if (profiles.length < 1) return errorRespone('no profiles', 'There are no profiles', res)
    res.json(profiles)
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

// Gets Profile by handle
export const getByHandle = async ({ params: { handle } }, res) => {
  try {
    // Find Proile By Handle
    const profile = await Profile.findOne({ handle })
    if (!profile) return errorRespone('no handle', 'There is no handle with that user', res)
    res.json(profile)
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

// Gets Profile by USER_ID
export const getById = async ({ params: { user_id } }, res) => {
  // Check if user_id is a valid Object ID
  if (!user_id.match(/^[a-fA-F0-9]{24}$/)) {
    return errorRespone('invalid id', 'The provided id is not a valid one', res)
  }
  // Find Proile By ID
  try {
    const profile = await Profile.findOne({ user: user_id })
    if (!profile) return errorRespone('no profile', 'There is no profile with that id', res)
    res.json(profile)
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

// Creates or Updates Profile
export const createProfile = async (req, res) => {
  // Validate Inputs
  const notValid = await ensureProfile(req.body)
  if (notValid) return res.status(400).json(notValid)
  // Get fields
  const profileFields = GetProfileFields(req)

  // Find The User Profile
  try {
    const profile = await Profile.findOne({ user: req.user._id })
    if (profile) {
      // Update
      // Check if handle exists
      const handle = await Profile.findOne({ handle: profileFields.handle }, 'handle')
      if (handle) return errorRespone('handle', 'That handle already exists', res)
      const updatedProfile = await Profile.findOneAndUpdate(
        { user: req.user._id },
        { $set: profileFields },
        { new: true }
      )
      res.json(updatedProfile)
    } else {
      // Create
      // Check if handle exists
      const profile = await Profile.findOne({ handle: profileFields.handle }, 'handle')
      if (profile) return errorRespone('handle', 'That handle already exists', res)
      // Save Porfile
      const newProfile = await new Profile(profileFields).save()
      res.json(newProfile)
    }
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

export const addExperience = async ({ body: { title, company, location, from, to, current, description }, user }, res) => {
  // Validate Inputs
  const newExp = { title, company, location, from, to, current, description }
  const notValid = await ensureProfileExp(newExp)
  if (notValid) return res.status(400).json(notValid)

  try {
    const profile = await Profile.findOne({ user: user._id })

    if (profile.experience.length >= 1) {
      return errorRespone('experience', 'experience is already set', res)
    }
    // Add to exp array
    profile.experience.unshift(newExp)
    const newProfile = await profile.save()
    res.json(newProfile)
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

export const delExperience = async ({ params: { exp_id }, user }, res) => {
  // Check if user_id is a valid Object ID
  if (!exp_id.match(/^[a-fA-F0-9]{24}$/)) {
    return errorRespone('invalid id', 'The provided id is not a valid one', res)
  }
  // Find Proile By ID
  try {
    const profile = await Profile.findOne({ user: user._id })
    if (!profile) return errorRespone('no profile', 'There is no profile with that id', res)
    // Get remove index
    if (profile.experience.length === 0) {
      return errorRespone('experience', 'experience is empty', res)
    }
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(exp_id)
    // Splice out of array
    profile.experience.splice(removeIndex, 1)
    const profileWithoutExperience = await profile.save()
    res.json(profileWithoutExperience)
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

export const addEducation = async ({ body: { school, degree, fieldofstudy, from, to, current, description }, user }, res) => {
  // Validate Inputs
  const newEdu = { school, degree, fieldofstudy, from, to, current, description }
  const notValid = await ensureProfileEdu(newEdu)
  if (notValid) return res.status(400).json(notValid)

  try {
    const profile = await Profile.findOne({ user: user._id })

    if (profile.education.length >= 1) {
      return errorRespone('education', 'education is already set', res)
    }
    // Add to exp array
    profile.education.unshift(newEdu)
    const newProfile = await profile.save()
    res.json(newProfile)
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

export const delEducation = async ({ params: { edu_id }, user }, res) => {
  // Check if user_id is a valid Object ID
  if (!edu_id.match(/^[a-fA-F0-9]{24}$/)) {
    return errorRespone('invalid id', 'The provided id is not a valid one', res)
  }
  // Find Proile By ID
  try {
    const profile = await Profile.findOne({ user: user._id })
    if (!profile) return errorRespone('no profile', 'There is no profile with that id', res)
    // Get remove index
    if (profile.education.length === 0) {
      return errorRespone('education', 'education is empty', res)
    }
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(edu_id)
    // Splice out of array
    profile.education.splice(removeIndex, 1)
    const profileWithoutEducation = await profile.save()
    res.json(profileWithoutEducation)
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}

export const delProfileAndUser = async (req, res) => {
  try {
    const profile = await Profile.findOneAndRemove({ user: req.user._id })
    if (!profile) return errorRespone('no profile', 'There is no profile with that id', res)
    const user = await User.findOneAndRemove({ _id: req.user._id })
    if (!user) return errorRespone('no user', 'There is no user with that id', res)
    res.json({ sucess: true })
  } catch (err) {
    return errorRespone(err.name, err.message, res)
  }
}
