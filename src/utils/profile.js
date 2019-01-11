export const GetProfileFields = fields => {
  const profileFields = {}
  profileFields.user = fields.user._id
  if (fields.body.handle) profileFields.handle = fields.body.handle
  if (fields.body.company) profileFields.company = fields.body.company
  if (fields.body.website) profileFields.website = fields.body.website
  if (fields.body.location) profileFields.location = fields.body.location
  if (fields.body.bio) profileFields.bio = fields.body.bio
  if (fields.body.status) profileFields.status = fields.body.status
  if (fields.body.githubusername) {
    profileFields.githubusername = fields.body.githubusername
  }
  // Skills - split into array
  if (typeof fields.body.skills !== 'undefined') {
    profileFields.skills = fields.body.skills.split(',')
  }
  // Social
  profileFields.social = {}
  if (fields.body.youtube) profileFields.social.youtube = fields.body.youtube
  if (fields.body.facebook) profileFields.social.facebook = fields.body.facebook
  if (fields.body.linkedin) profileFields.social.linkedin = fields.body.linkedin
  if (fields.body.twitter) profileFields.social.twitter = fields.body.twitter
  if (fields.body.instagram) {
    profileFields.social.instagram = fields.body.instagram
  }

  return profileFields
}
